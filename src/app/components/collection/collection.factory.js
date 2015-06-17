'use strict';

angular.module('crucio')
  .factory('Collection', function($window, $mdToast, $location, API, Auth, Analytics) {
  /* A collection consists of:
		 - collection_id (if already saved)
		 - questions (assoc. array with all question data)
		 - question_id_list (array of all question_ids in order)
		 - user_data (assoc. array with all user data for the questions, e.g. strike, given result...)
		 - is_exam
		 - info
		*/

    try {
      var collection = angular.fromJson(localStorage.collection);
    }
    catch (e) {
      localStorage.removeItem('collection');
      var collection = angular.fromJson(localStorage.collection);
    }

		var get_random = function(min, max) {
			if (min > max) { return -1; }
			if (min === max) { return min; }

			var r;
			do {
				r = Math.random();
			} while (r === 1.0);

			return min + parseInt(r * (max - min + 1));
		};

		var functions = {
			getCollection: function() {
				return collection;
			},
			setCollection: function(newCollection) {
				collection = newCollection;
				localStorage.collection = angular.toJson(newCollection);
			},
			setID: function(newID) {
				collection.collection_id = newID;
			},
			loadCollection: function(collection_id) {
				API.get('/collections/' + collection_id).success(function(data) {
					collection = data.collection.data;
          functions.setCollection(collection);
				});
			},
			saveCollection: function() {
				var save_collection = collection;
				delete save_collection.questions;
				var postData = {data: save_collection, user_id: Auth.getUser().user_id};
				if (save_collection.collection_id) {
					API.put('/collections/' + save_collection.collection_id, post_data).success(function() {
            $mdToast.show($mdToast.simple().content('Sammlung gespeichert!').position('top right').hideDelay(2000));
          });
          Analytics.trackEvent('collection', 'update');

				} else {
					API.post('/collections', postData).success(function(data) {
						collection.collection_id = data.collection_id;
            $mdToast.show($mdToast.simple().content('Sammlung gespeichert!').position('top right').hideDelay(2000));
					});
          Analytics.trackEvent('collection', 'save');
				}
			},
			deleteCollection: function(collectionID) {
				API.delete('/collections/' + collectionID);
        Analytics.trackEvent('collection', 'delete');
			},
      learnCollection: function(method, type_url, params) {
        if (method === 'question') { params.load_first_question = true; }
        if (method === 'exam') { params.load_questions = true; }

        API.get('/collections/prepare' + type_url, params).success(function(data) {
          functions.setCollection(data.collection);

          switch (method) {
            case 'question':
              $location.path('/question').search('id', data.collection.question_id_list[0]);
              break;

            case 'exam':
              $location.path('/exam');
              break;

            case 'pdf':
              var question_id_list = data.collection.question_id_list.join(',');
              var collection_info = angular.toJson(data.collection.info);
              $window.location.assign('http://dev.crucio-leipzig.de/api/v1/pdf/collection?question_id_list='+question_id_list+'&collection_info='+collection_info);
              break;

            case 'pdf-both':
              var question_id_list = data.collection.question_id_list.join(',');
              var collection_info = angular.toJson(data.collection.info);
              $window.location.assign('http://dev.crucio-leipzig.de/api/v1/pdf/both?question_id_list='+question_id_list+'&collection_info='+collection_info);
              break;
          }
        });
        Analytics.trackEvent('collection', 'learn', method);
      },
			getAnsweredQuestionIDList: function() {
				var result = [];
				for (var i in collection.question_id_list) {
					var question_id = collection.question_id_list[i];
					if (collection.user_datas[question_id]) {
            if (collection.user_datas[question_id].given_result) {
  						result.push(question_id);
  					}
					}
		    }
				return result;
			},
			getAnsweredQuestionList: function() {
				var result = [];
				for (var i in collection.question_id_list) {
					var question_id = collection.question_id_list[i];
					if (collection.user_datas[question_id].given_result) {
						result.push(collection.questions[question_id]);
					}
		    }
				return result;
			},
			getIndexOfQuestionID: function(id) {
				return collection.question_id_list.indexOf(id);
			},
			getQuestion: function(id) {
				if (collection.questions[id]) {
					return collection.questions[id];
				}
				return null;
			},
			loadQuestion: function(id, userID) {
        return API.get('/questions/' + id, {user_id: userID}).success(function(data) {
					collection.questions[id] = data.question;
				});
			},
			getNextQuestionID: function(current_index) {
				if (current_index < collection.question_id_list.length - 1) {
					return collection.question_id_list[current_index + 1];
				}
				return null;
			},
			getPrevQuestionID: function(current_index) {
				if (current_index > 0) {
					return collection.question_id_list[current_index - 1];
				}
				return null;
			},
			getNewUserData: function() {
				return {strike: [], marked: null, given_result: null};
			},
			getAnalysis: function() {
				var answered_question_id_list = this.getAnsweredQuestionIDList();

				var result = {
					all_question_count: collection.question_id_list.length,
					worked_question_count: answered_question_id_list.length,
					correct_q_count: 0,
					wrong_q_count: 0,
					seen_q_count: 0,
					solved_q_count: 0,
					free_q_count: 0,
					no_answer_q_count: 0
				};

				for (var i = 0; i < answered_question_id_list.length; i++) {
					var question_id = answered_question_id_list[i];
					var question = collection.questions[question_id];
					var user_data = collection.user_datas[question_id];

					// Question is seen
					if (user_data.given_result > -2) {
						result.seen_q_count++;
					}

					// Free Question (just one solution)
					if (question.type === 1) {
						result.free_q_count++;

					// Question is multiple choice
					} else if (question.type > 1) {
						// Question was answered, a result is given
						if (user_data.given_result > 0) {
							result.solved_q_count++;

							// Question has a saved correct answer
							if (question.correct_answer > 0) {
								if (question.correct_answer === user_data.given_result) { result.correct_q_count++; }
								if (question.correct_answer !== user_data.given_result) { result.wrong_q_count++; }

							// Question has not a saved correct answer
							} else {
								result.no_answer_q_count++;
							}
						}
					}
				}
				return result;
			},
			getAnalysisDescription: function(analysis) {
				// Get Random number
				var random = get_random(0, 1000);

				var textHTML = '';
				textHTML += 'Die Klausur umfasste <strong>';
				textHTML += analysis.all_question_count + ' Frage' + (analysis.all_question_count > 1 ? 'n' : '');
				textHTML += '</strong>, von denen du <strong>';
				textHTML += analysis.all_question_count === analysis.worked_question_count ? 'alle bearbeitet' : (analysis.worked_question_count + ' bearbeitet');
				textHTML += '</strong> hast. ';

				if (analysis.solved_q_count === 0) {
					textHTML += 'Allerdings hast du <strong class="text-danger">keine Frage gelöst</strong>. Kann man nicht sehen, wohin wir kämen, wenn wir gingen...';
				}

				if (analysis.solved_q_count > 0) {
					if (analysis.free_q_count > 0 || analysis.no_answer_q_count > 0) {
						textHTML += 'Es ';

						if (analysis.free_q_count > 0) {
							if (analysis.free_q_count === 1) {
								textHTML += 'war <strong class="text-info">eine freie Frage</strong>';

							} else {
								textHTML += 'waren <strong class="text-info">' + analysis.free_q_count + ' freie Fragen</strong> ';
							}
						}

						if (analysis.free_q_count > 0 && analysis.no_answer_q_count > 0) {
							textHTML += 'und ';
						}

						if (analysis.free_q_count === 0) {
							if (analysis.no_answer_q_count === 1) {
								textHTML += 'war ';
							} else {
								textHTML += 'waren ';
							}
						}

						if (analysis.no_answer_q_count === 1) {
							textHTML += '<strong class="text-warning">eine Frage ohne gespeicherte Antwort</strong> ';

						} else if (analysis.no_answer_q_count > 1) {
							textHTML += '<strong class="text-warning">' + analysis.no_answer_q_count + ' Fragen ohne gespeicherte Antwort</strong> ';
						}

					  textHTML += 'dabei, insgesamt hast du so ' + analysis.solved_q_count + ' Frage' + (analysis.solved_q_count > 1 ? 'n':'') + ' gelöst. ';
					}

					if (analysis.solved_q_count > 0) {
						if (analysis.correct_q_count === analysis.solved_q_count) {
							textHTML += 'Du konntest <strong class="text-success">alle Fragen richtig beantworten</strong>. Wenn du so weiter machst, wirst du mal Chefarzt. ';

            } else if (analysis.wrong_q_count != analysis.solved_q_count && analysis.no_answer_q_count !== analysis.solved_q_count) {
							textHTML += 'Du konntest ';
							textHTML += '<strong class="text-success">' + analysis.correct_q_count + ' Frage' + (analysis.correct_q_count > 1 ? 'n':'') + ' richtig beantworten</strong>,';

							textHTML += ' von';
							if (analysis.wrong_q_count == 1) {
								textHTML += ' der falsch beantworteten Frage</strong>';
							} else if (analysis.wrong_q_count > 1) {
								textHTML += ' den <strong class="text-danger">' + analysis.wrong_q_count + ' falsch beantworteten Fragen</strong>';
							}

							textHTML += ' weißt du jetzt immerhin die Antwort. ';

							textHTML += 'Das entspricht einer Quote von <strong>' + Math.ceil(1000 * analysis.correct_q_count / analysis.solved_q_count) / 10 + '%</strong>. ';

							if (analysis.correct_q_count >= analysis.wrong_q_count) {
								switch ( (random + 1) % 2 ) {
									case 0: textHTML += 'Du wirst mal ein guter Arzt.'; break;
									case 1: textHTML += 'Da sieht man klar deine Ambitionen auf den Chefarztsessel.'; break;
								}
							}

							if (analysis.correct_q_count < analysis.wrong_q_count) {
								switch ( (random + 2) % 4 ) {
									case 0: textHTML += 'Dein Patient wäre leider, nunja, tot.'; break;
									case 1: textHTML += 'Den Patienten kriegen wir jetzt nur noch chirurgisch wieder heile.'; break;
									case 2: textHTML += 'Da hoffen wir mal, dass dein Patient kein Rechtsanwalt ist. :)'; break;
									case 3: textHTML += 'Eine gute Berufshaftplichtversicherung ist also das A und O...'; break;
								}
							}
						}

						if (analysis.wrong_q_count === analysis.solved_q_count) {
							textHTML += 'Du konntest <strong class="text-danger">keine Frage richtig beantworten</strong>. Komm schon, ein Arzt hat ja auch Vorbildfunktion.';
						}

						if (analysis.no_answer_q_count === analysis.solved_q_count) {
							textHTML += 'Vielleicht kannst du uns mithelfen richtige Antworten herauszufinden?';
						}
					}
				}

				return textHTML;
			}
		};

    return functions;
	});
