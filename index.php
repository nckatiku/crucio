<!DOCTYPE html>
<html id="ng-app" lang="de" ng-app="crucio.outside">
	<head>
		<?php include 'parts/header.php'; ?>

		<title>Crucio | Fachschaft Medizin <?php echo $config['city'] ?></title>
		
		<script src="public/js/smooth-scroll.min.js"></script>
		<script>
			smoothScroll.init();
			
			var module = angular.module('crucio.outside', []);
			module.controller('ctrl', function($scope, $http, $window) {
				// Check if user is in session storage
				if (angular.isDefined(localStorage.user)) {
					$window.location.replace('/questions');
				
				// Check if user is in local storage (persistant)
				} else if (angular.isDefined(sessionStorage.user)) {
					localStorage.user = sessionStorage.user;
					$window.location.replace('/questions');
				}
				
				// Init Values
				$scope.remember_me = true;
				
				// Login Function
				$scope.login = function() {
					
					// Errors
					$scope.has_error = false;
					
					// Form Validation 
					var validation = true;
					if (!$scope.email) {
						$scope.has_error = true;
						validation = false;
					}
					if (!$scope.password) {
						$scope.has_error = true;
						validation = false;
					}
					if (!validation) { return false; }
				
					if ($scope.email.indexOf("@") == -1) {
						$scope.email += '@studserv.uni-leipzig.de';
					}
					
					var post_data = { email: $scope.email, password: $scope.password, remember_me: $scope.remember_me };
					$http.post('api/v1/users/action/login', post_data).success(function(data) {
						if (data.login == 'success') {
							// Set cookie if user should be remembered
						    if ($scope.remember_me == 1) {
							    localStorage.user = angular.toJson(data.logged_in_user);
						    }	
							sessionStorage.user = angular.toJson(data.logged_in_user);
							sessionStorage.fresh_login = true;
			    			$window.location.replace('/questions');
						
			    		} else {
				    		$scope.has_error = true;
			    		}
					});
				}
			});
		</script>
	</head>

	<body class="body">
	    <div class="wrap">
	    	<div class="container-top-bar">
	    		<div class="container">
		    		<form class="row" ng-controller="ctrl">
			    		<div class="col-sm-3 col-sm-offset-4">
				    		<div class="form-group element">
	        		    	    <input class="form-control form-control-out" type="text" placeholder="E-Mail-Adresse" ng-class="{'has-error': has_error}" ng-model="email" autofocus>
	        		    	    <label class="checkbox">
				        			<input type="checkbox" style="margin-top:2px;" ng-model="remember_me">
				        			Angemeldet bleiben
								</label>
	        		    	</div>
			    		</div>

			    		<div class="col-sm-3">
				    		<div class="form-group element">
	        		    	    <input class="form-control form-control-out" type="password" placeholder="Passwort" ng-class="{'has-error': has_error}" ng-model="password">
	        		    	    <label for="passwordInput">
	        		    	    	<a href="forgot-password" target="_self">Passwort vergessen?</a>
	        		    	    </label>
	        		    	</div>
			    		</div>

			    		<div class="col-sm-2">
				    		<button class="btn btn-index-top" ng-click="login()">
					        	<i class="fa fa-sign-in fa-fw"></i> Anmelden
							</button>
			    		</div>
		    		</form>
	    		</div>
	    	</div>

	    	<div class="container-back-image container-padding-6">
	    		<div class="container">
	    			<div class="brand">
					    <h1><i class="fa fa-check-square-o"></i> Crucio</h1>
					    
					    <p>... hilft dir bei der Vorbereitung f�r Medizinklausuren an der Universit�t <?php echo $config['city'] ?>.
							Hier werden �bungsfragen aus dem Studium gesammelt, gekreuzt und erkl�rt.</p>
						
						<a class="btn btn-lg" href="register" target="_self">Registrieren</a>
				        <a class="btn btn-lg" href="#more" target="_self" data-scroll>Mehr Infos</a>
					</div>
				</div>

				<img class="center-block img-responsive image-med-exam" src="public/images/med_3x.png">
	    	</div>

	    	<div class="container-light-grey container-padding-2">
				<div class="sturamed">
				    <p>Crucio - Ein Projekt eures</p>
				    <a href="http://<?php echo $config['representation-website']; ?>"><img src="public/images/sturamed.svg" width="245px"></a>
				</div>
			</div>

			<span id="more"></span>
	    	<div class="container container-padding-6">
				<div class="row">
				    <div class="col-sm-4 info-block-crucio">
				    	<i class="fa fa-book"></i>
				    	<h2>Lernen</h2>
				    	<p>Mit Crucio kannst du Fragen & �bungsklausuren anschauen, lernen, wiederholen und erkl�ren lassen. Hier sind alle Fragen, die bisher an der Uni <?php echo $config['city'] ?> gesammelt wurden, vereint. Damit sind die Fragen mit dem Studium in <?php echo $config['city'] ?> abgestimmt, sodass du perfekt f�r die n�chsten Klausuren vorbereitet bist.</p>
				    </div>

				    <div class="col-sm-4 info-block-crucio">
				    	<i class="fa fa-inbox"></i>
				    	<h2>�bersicht</h2>
				    	<p>Crucio ist ein zentraler Ort f�r Fragen und �bungsklausuren an & von der Universit�t <?php echo $config['city'] ?>. Die �bungsklausuren sind automatisch nach deinem Semester sortiert, du kannst aber nat�rlich nach Fachbereich oder einzelnen Fragen suchen. So kannst du dir deine Zeit und Nerven f�r Inhalte aufheben.</p>
				    </div>

				    <div class="col-sm-4 info-block-crucio">
				    	<i class="fa fa-bar-chart-o"></i>
				    	<h2>Statistik</h2>
				    	<p>Mit Crucio kannst du genau analysieren, welche Fragen aus welchem Fachbereich du richtig oder falsch gel�st hast. Oder wo deine Schwachpunkte bei einer bestimmten Klausur sind, damit es beim n�chsten Mal umso besser klappt. <br><small>Noch nicht verf�gbar.</small></p>
				    </div>
				</div>
			</div>

	    	<div class="container-light-grey container-padding-2">
				<div class="cite">
					<h3>Heureka, Papier ist [...] sowas von gestern!</h3>
					<i class="fa fa-quote-left pull-left"> <a href="http://de.wikipedia.org/wiki/Epikur">Epikuros von Samos</a></i>
				</div>
			</div>

			<div class="container container-padding-6">
				<div class="row">
				    <div class="col-sm-4 info-block-crucio">
				    	<i class="fa fa-comments-o"></i>
				    	<h2>Austauschen</h2>
				    	<p>Wenn du Schwierigkeiten hast und eine Frage nicht verstehst, kannst du einfach die Kommentarfunktion auf Crucio nutzen. Die Autoren oder freundliche Kommilitonen k�nnen dann sicher weiterhelfen...</p>
				    </div>

				    <div class="col-sm-4 info-block-crucio">
				    	<i class="fa fa-car"></i>
				    	<h2>�berall</h2>
				    	<p>Du kannst Klausuren und deren L�sungszettel separat ausdrucken. Au�erdem ist Crucio f�r Smartphones und Tablets angepasst. So kannst du �berall entfallende Antworten nachschauen oder unterwegs weiterlernen. F�ge doch Crucio zu deinem Startbildschirm als hinzu!</p>
				    </div>

				    <div class="col-sm-4 info-block-crucio">
				    	<i class="fa fa-pencil"></i>
				    	<h2>Mitmachen</h2>
				    	<p>Crucio lebt von deiner Anteilnahme! Wenn du dich engagieren willst, kannst du Fragen & Klausuren eintragen, Fehler korrigieren oder Erkl�rungen schreiben. Melde dich einfach digital unter 'Kontakt' oder bei uns in der Fachschaft Medizin.</p>
				    </div>
				</div>
			</div>
	    </div>

	    <?php include 'parts/footer.php'; ?>
	</body>
</html>