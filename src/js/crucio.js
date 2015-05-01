// -------- Global Variables ----------

var base_url = window.location.origin;
var is_dev = (base_url.indexOf("dev") == 7) ? 1 : 0;

var subject_list = {
	'Anästhesie und Intensivmedizin':[],

	'Biologie': [],

	'Biochemie': ['Chemie der Kohlenhydrate', 'Chemie der Aminosäuren, Peptide und Proteine', 'Chemie der Fettsäuren und Lipide', 'Chemie der Nukleotide und Nukleinsäuren', 'Vitamine und Koenzyme', 'Enzyme', 'Ernährung, Verdauung, Resorption', 'Abbau der Kohlenhydrate', 'Abbau der Fettsäuren, Ketonkörper', 'Aminosäurestoffwechsel', 'Zitratzyklus und Atmungskette', 'Glykogenstoffwechsel, Glukoneogenese', 'Biosynthese der Fettsäuren, Lipogenese', 'Mineral- und Elektrolythaushalt', 'Subzelluläre Strukturen', 'Nukleinsäuren, genetische Information, Molekularbiologie', 'Hormone', 'Immunchemie', 'Blut', 'Leber', 'Fettgewebe', 'Niere, Harn', 'Muskelgewebe, Bewegung', 'Binde- und Stützgewebe', 'Nervensystem'],

	'Physik': [],
	
	'Physiologie': ['Allgemeine und Zellphysiologie, Zellerregung', 'Blut und Immunsystem', 'Herz', 'Blutkreislauf', 'Atmung', 'Arbeit- und Leistungsphysiologie', 'Ernährung, Verdauungstrakt, Leber', 'Energie- und Wärmehaushalt', 'Wasser- und Elektrolythaushalt, Nierenfunktion', 'Hormonale Regulationen', 'Sexualentwicklung und Reproduktionsphysiologie', 'Funktionsprinzipien des Nervensystems', 'Muskulatur', 'Vegetatives Nervensystem', 'Motorik', 'Somatoviszerale Sensorik', 'Visuelles System', 'Auditorisches System', 'Chemische Sinne', 'Integrative Leistungen des Zentralnervensystems'],

	'Chemie': [],

	'Klinische Chemie': [],

	'Histologie': [],

	'Gynäkologie':[],

	'Chirurgie': [],

	'Pharmakologie': [],

	'Allgemeine Pathologie': [],

	'Mikrobiologie / Virologie / Immunologie / Hygiene': [],

	'Psychologie': []
};


var crucioApp = angular.module('crucioApp', ['ngRoute', 'ngSanitize', 'angular-loading-bar', 'ui.bootstrap', 'angularFileUpload', 'textAngular', 'angles', 'ipCookie', 'crucioModule', 'userModule', 'learnModule', 'authorModule', 'adminModule']);



crucioApp.config(function($routeProvider, $locationProvider) {

    $routeProvider
    	.when('', { templateUrl: 'index.php', controller: 'loginCtrl' })
    	.when('/', { templateUrl: 'index.php', controller: 'loginCtrl' })
    	.when('/forgot-password', { templateUrl: 'forgot-password.php', controller: 'forgotPasswordCtrl' })
    	.when('/register', { templateUrl: 'register.php', controller: 'registerCtrl' })
    	.when('/activate-account', { templateUrl: 'activate-account.php', controller: 'activateCtrl' })
    	.when('/contact', { templateUrl: 'contact.php', controller: 'contactCtrl' })
    	.when('/about', { templateUrl: 'about.php', controller: 'aboutCtrl' })
    	.when('/blog', { templateUrl: 'blog.php', controller: 'blogCtrl' })
    	.when('/stats', { templateUrl: 'stats.php', controller: 'blogCtrl' })


		.when('/questions', { templateUrl : 'views/questions.html', controller: 'questionsCtrl' })
    	.when('/author', { templateUrl : 'views/author.html', controller: 'authorCtrl' })
    	.when('/admin', { templateUrl : 'views/admin.html', controller: 'adminCtrl' })
    	.when('/account', { templateUrl : 'views/account.html', controller: 'accountCtrl' })
    	.when('/settings', { templateUrl : 'views/settings.html', controller: 'settingsCtrl' })
    	.when('/edit-exam', { templateUrl : 'views/edit-exam.html', controller: 'editCtrl' })
    	.when('/question', { templateUrl : 'views/question.html', controller: 'questionCtrl' })
    	.when('/exam', { templateUrl : 'views/exam.html', controller: 'examCtrl' })
    	.when('/statistics', { templateUrl : 'views/statistics.html', controller: 'statisticsCtrl' })
    	.when('/exam-pdf', { templateUrl : 'exam-pdf.php', controller: 'examCtrl' })
    	.when('/exam-solution-pdf', { templateUrl : 'exam-solution-pdf.php', controller: 'examCtrl' })
    	.when('/analysis', { templateUrl : 'views/analysis.html', controller: 'analysisCtrl' })
		.when('/403', { templateUrl : 'views/403.html', controller: 'errorCtrl' })
    	.when('/404', { templateUrl : 'views/404.html', controller: 'errorCtrl' })
    	.when('/500', { templateUrl : 'views/500.html', controller: 'errorCtrl' })

    	.otherwise({ redirectTo: '/404' });

    // use the HTML5 History API
	$locationProvider.html5Mode(true);
});

crucioApp.run(function (ipCookie, $rootScope, $location) {
	
	// enumerate routes that don't need authentication
	var routesThatDontRequireAuth = ['/', '/contact', '/about', '/register', '/activate-account', '/forgot-password'];
	var routesThatLogin = ['/', '/register', '/forgot-password'];
	var routesForAuthor = ['/author', '/edit-exam'];
	var routesForAdmin = ['/admin']; // + Author Routes

	$rootScope.user = angular.fromJson(sessionStorage.user);
	$rootScope.is_dev = is_dev;

	var cookieUser = ipCookie('CrucioUser');

	if(!$rootScope.user) {
		if(cookieUser) {
			$rootScope.user = cookieUser;
			sessionStorage.user = angular.toJson(cookieUser);
		}
	}
	
	var routeInArray = function (route, array) {
		var route_c = route;
		if(route.indexOf('?') > -1)
			route_c = route.substr(0, route.indexOf('?'));
		return ( array.indexOf(route_c) > -1) ? 1 : 0;
	};

	if($rootScope.user) {
	    var isLoggedIn = ($rootScope.user.group_id) ? 1 : 0;
	    var isAuthor = ($rootScope.user.group_id == 3) ? 1 : 0;
	    var isAdmin = ($rootScope.user.group_id == 2) ? 1 : 0;

	} else {
	    var isLoggedIn = 0;
	    var isAuthor = 0;
	    var isAdmin = 0;
	}

	if (!routeInArray($location.url(), routesThatDontRequireAuth) && !isLoggedIn) {
		// $location.path('');
	}
	if (routeInArray($location.url(), routesThatLogin) && isLoggedIn) {
		$location.path('/questions');
	}
	if (routeInArray($location.url(), routesForAuthor) && !(isAuthor || isAdmin)) {
		$location.path('/403');
	}
	if (routeInArray($location.url(), routesForAdmin) && !isAdmin) {
		$location.path('/403');
	}
});


crucioApp.factory('Page', function() {
	var title = 'Crucio';
	var nav = '';

	return {
    	title: function() { return title; },
		setTitle: function(arg) { title = arg; },
		nav: function() { return nav; },
		setNav: function(arg) { nav = arg; },
		set_title_and_nav: function(new_title, new_nav) { title = new_title; nav = new_nav; }
	};
});

crucioApp.service('Selection', function() {
	this.is_element_included = function(element, search_dictionary) {
		for (var key in search_dictionary) {
			if (key == 'query') {
				var query_string = '';
				search_dictionary.query_keys.forEach(function(query_key) {
				    query_string += element[query_key] + ' ';
				});

				var substring_array = search_dictionary.query.toLowerCase().split(' ');
				for (var i = 0, len = substring_array.length; i < len; ++i) {
					var substring = substring_array[i];
					if (query_string.toLowerCase().indexOf(substring) < 0 && substring) { return false; }
				}

			} else if (key == 'group') {
				if (search_dictionary.group != element.group_name && search_dictionary.group) { return false; }
				
			} else if (key != 'query_keys') {
				if (search_dictionary[key] != element[key] && search_dictionary[key]) { return false; }
			}
		}
		return true;
	}

	this.count = function(list, search_dictionary) {
		if(!list) { return 0; }

		var counter = 0;
		for (var i = 0; i < list.length; i++) {
			if (this.is_element_included(list[i], search_dictionary)) { counter++; }
		}

		return counter;
	}

	this.find_distinct = function(list, search_key) {
		var result = [];
		list.forEach(function(entry) {
			if (result.indexOf(entry[search_key]) == -1) {
				result.push(entry[search_key]);
			}
		});
		result.sort();
		return result;
	}
});

crucioApp.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) { return ''; };

        max = parseInt(max, 10);
        if (!max) { return value };
        if (value.length <= max) { return value; };

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' ?');
    };
});



Array.prototype.getIndexBy = function(name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
}

Array.prototype.getArrayByKey = function(name) {
	var array = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i][name]) {
            array.push(this[i]);
        }
    }
    return array;
}