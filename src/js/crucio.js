// -------- Global Variables ----------
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


var app = angular.module('crucioApp', ['ngRoute', 'ngSanitize', 'angular-loading-bar', 'ui.bootstrap', 'angles', 'crucioModule', 'userModule', 'learnModule', 'authorModule', 'adminModule']);

app.config(function($routeProvider, $locationProvider) {
	// Crucio Routing
    $routeProvider
		.when('/questions', { templateUrl : 'views/questions.html', controller: 'questionsCtrl' })
		.when('/question', { templateUrl : 'views/question.html', controller: 'questionCtrl' })
		.when('/exam', { templateUrl : 'views/exam.html', controller: 'examCtrl' })
		.when('/analysis', { templateUrl : 'views/analysis.html', controller: 'analysisCtrl' })
    	.when('/account', { templateUrl : 'views/account.html', controller: 'accountCtrl' })
    	.when('/settings', { templateUrl : 'views/settings.html', controller: 'settingsCtrl' })
    	.when('/author', { templateUrl : 'views/author.html', controller: 'authorCtrl' })
    	.when('/edit-exam', { templateUrl : 'views/edit-exam.html', controller: 'editCtrl' })
    	.when('/admin', { templateUrl : 'views/admin.html', controller: 'adminCtrl' })
    	.when('/statistics', { templateUrl : 'views/statistics.html', controller: 'statisticsCtrl' })
    	.when('/exam-pdf', { templateUrl : 'exam-pdf.php', controller: 'examCtrl' })
    	.when('/exam-solution-pdf', { templateUrl : 'exam-solution-pdf.php', controller: 'examCtrl' })
    	
		.when('/403', { templateUrl : 'views/403.html', controller: 'errorCtrl' })
    	.when('/404', { templateUrl : 'views/404.html', controller: 'errorCtrl' })
    	.when('/500', { templateUrl : 'views/500.html', controller: 'errorCtrl' })

    	.otherwise({ redirectTo: '/404' });

    // Use the HTML5 history API
	$locationProvider.html5Mode(true);
});

app.run(function ($location, Auth) {
	// Routes that need specific authentication
	var routesForAuthor = ['/author', '/edit-exam']; // Also for admins...
	var routesForAdmin = ['/admin'];
	
	var routeInArray = function (route, array) {
		var route_c = route;
		if(route.indexOf('?') > -1) {
			route_c = route.substr(0, route.indexOf('?'));
		}
		return ( array.indexOf(route_c) > -1) ? true : false;
	};
	
	var user = Auth.user();
	var isLoggedIn = false;
	var isAuthor = false;
	var isAdmin = false;
	if (user) {
		if (user.group_id) { isLoggedIn = true; }
		if (user.group_id == 3) { isAuthor = true; }
		if (user.group_id == 2) { isAdmin = true; }
	}
	
	var route = $location.url();
	if (routeInArray(route, routesForAuthor) && !(isAuthor || isAdmin)) {
		$location.path('/403');
	}
	if (routeInArray(route, routesForAdmin) && !isAdmin) {
		$location.path('/403');
	}
});


// --- Global Services ---

app.factory('Page', function() {
	var title = 'Crucio'; // Title of HTML page
	var nav = ''; // Determines the selected element in the navbar

	return {
    	title: function() { return title; },
		setTitle: function(newTitle) { title = newTitle; },
		nav: function() { return nav; },
		setNav: function(newNav) { nav = newNav; },
		setTitleNav: function(newTitle, newNav) { title = newTitle; nav = newNav; }
	};
});

app.factory('Auth', function($window) {
	var user; // Current user object
	
	return {
		user: function() { // Get current user
			// Check if user is in already in user object
			if (angular.isDefined(user)) {
				// Pass...
			
			// Check if user is in session storage
			} else if (angular.isDefined(sessionStorage.user)) {
				user = angular.fromJson(sessionStorage.user);
					
			// Check if user is in local storage
			} else if (angular.isDefined(localStorage.user)) {
				sessionStorage.user = localStorage.user;
				user = angular.fromJson(localStorage.user);
				
			// If there is no user data, return to login page
			} else {
				$window.location.replace($window.location.origin);
			}
			
			return user;
		},
		logout: function() { // Log current user out
			sessionStorage.removeItem('user');
			localStorage.removeItem('user');
			$window.location.replace($window.location.origin);
		}
	};
});






app.service('Selection', function() {
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
		if (!list) { return 0; }

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