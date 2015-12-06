class AuthorController {
    constructor(Page, Auth, API, Selection, $scope, $location) {
        this.API = API;
        this.Selection = Selection;
        this.$location = $location;

        Page.setTitleAndNav('Autor | Crucio', 'Autor');

        this.user = Auth.getUser();

        this.subject_list = subject_list;

        this.exam_search = { 'subject': '', 'semester': '', 'author': this.user.username, 'query': '', 'query_keys': ['subject', 'author', 'date'] };
        this.comment_search = { 'username_added': '', 'username': '', 'query': '', 'query_keys': ['question', 'comment', 'username', 'question_id'] };


        $scope.$watch(() => this.comment_search, (newValue) => {
            this.questions_by_comment_display = [];
            if (this.questions_by_comment) {
                for (const comments of this.questions_by_comment) {
                    for (const comment of comments) {
                        if (this.Selection.is_element_included(comment, newValue)) { // Check if comment satisfies search query
                            let found_idx = -1;
                            for (let j = 0; j < this.questions_by_comment_display.length; j++) {
                                if (this.questions_by_comment_display[j][0].question == comment.question) {
                                    found_idx = j;
                                    break;
                                }
                            }

                            if (found_idx > -1) { // Add to array at found index
                                this.questions_by_comment_display[found_idx].push(comment);
                            } else { // Create new array
                                this.questions_by_comment_display.push([comment]);
                            }
                        }
                    }
                }
            }
            this.questions_by_comment_display.sort((a, b) => { return b[0].date - a[0].date; });
        }, true);

        this.API.get('exams').success((result) => {
            this.exams = result.exams;

            console.log(this.exams);

            this.distinct_semesters = this.Selection.find_distinct(this.exams, 'semester');
            this.distinct_subjects = this.Selection.find_distinct(this.exams, 'subject');
            this.distinct_authors = this.Selection.find_distinct(this.exams, 'author');

            this.ready = 1;
        });

        this.API.get('comments/author/' + this.user.user_id).success((result) => {
            this.comments = result.comments;

            // Find Distinct Comments
            this.distinct_users = [];
            this.distinct_users_added = [];

            this.distinct_users = this.Selection.find_distinct(this.comments, 'username');
            this.distinct_users_added = this.Selection.find_distinct(this.comments, 'username_added');

            this.questions_by_comment = [];
            for (const c of this.comments) {
                let found = -1;
                for (let i = 0; i < this.questions_by_comment.length; i++) {
                    if (this.questions_by_comment[i][0].question == c.question) {
                        found = i;
                        break;
                    }
                }

                if (found > 0) {
                    this.questions_by_comment[found].push(c);
                } else {
                    this.questions_by_comment.push([c]);
                }
            }
            this.questions_by_comment.sort((a, b) => { return b[0].date - a[0].date; });
            this.questions_by_comment_display = this.questions_by_comment;

            this.comment_search.username_added = this.user.username;
        });
    }

    new_exam() {
        const data = {
            'subject': '',
            'professor': '',
            'semester': '',
            'date': '',
            'type': '',
            'user_id_added': this.user.user_id,
            'duration': '',
            'notes': '',
        };

        this.API.post('exams', data).success((result) => {
            this.$location.path('/edit-exam').search('id', result.exam_id);
        });
    }

    comment_in_selection(index) {
        return this.Selection.is_element_included(this.comments[index], this.comment_search);
    }

    comment_in_selection_count() {
        return this.Selection.count(this.comments, this.comment_search);
    }

    exam_in_selection(index) {
        return this.Selection.is_element_included(this.exams[index], this.exam_search);
    }

    exam_in_selection_count() {
        return this.Selection.count(this.exams, this.exam_search);
    }
}

angular.module('authorModule').controller('AuthorController', AuthorController);