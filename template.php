<?php $config = include('public/php/config.php'); ?>

<!DOCTYPE html>
<html id="ng-app" lang="de" ng-app="app">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1" />
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="apple-mobile-web-app-title" content="Crucio">
		
		<base href="http://<?php echo $_SERVER['SERVER_NAME']; ?>/">
		
		<link rel="shortcut icon" href="public/images/favicon.png" type="image/png" />
		<link rel="icon" href="public/images/favicon.png" type="image/png" />
		<link rel="apple-touch-icon" href="public/images/apple-icon.png" />
		<link rel="apple-touch-icon-precomposed" href="public/images/apple-icon.png" />
		
		<link rel="stylesheet" href="public/css/crucio.min.css" />
		<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Lato:300,400,700" />
		
		<title ng-controller="titleCtrl" ng-bind="title()"></title>
	</head>

	<body class="body-padding" style="visibility: hidden;" data-spy="scroll" data-target=".admin-nav" data-offset="90">
		<div class="wrap">
			<nav class="navbar navbar-default navbar-fixed-top" role="navigation" ng-controller="navCtrl">
				<div class="container">
					<div class="row">
						<div class="col-sm-5 col-md-4 col-md-offset-1">
							<div class="navbar-header">
					    	    <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-collapse-1">
				        	        <span class="icon-bar"></span>
				        	        <span class="icon-bar"></span>
				        	        <span class="icon-bar"></span>
				        	    </button>
			
				        	    <a class="navbar-brand" href="/learn">
					        	    <i class="fa fa-check-square-o"></i>  Crucio
					        	</a>
				        	</div>
				        </div>
			
				        <div class="col-sm-7">
							<div class="collapse navbar-collapse" id="navbar-collapse-1">
								<ul class="nav navbar-nav navbar-right">
								    <li class="navbar-element" ng-class="{ active: nav() == 'Lernen'}">
								    	<a href="learn">Lernen</a>
								    </li>
								    
								    <!--li class="navbar-element" ng-class="{ active: nav() == 'Statistik'}">
								    	<a href="statistics">Statistik</a>
								    </li-->
			
									<li class="navbar-element" ng-class="{ active: nav() == 'Autor'}" ng-if="user.group_id == 2 || user.group_id == 3">
								    	<a href="author">Autoren</a>
								    </li>
			
								    <li class="navbar-element" ng-class="{ active: nav() == 'Admin'}" ng-if="user.group_id == 2">
								    	<a href="admin">Admin</a>
								    </li>
			
						    	    <li class="dropdown" ng-class="{ active: nav() == 'Name'}" dropdown>
						    	    	<a class="dropdown-toggle" dropdown-toggle href>
						    	    		<span ng-bind="user.username"></span> <b class="caret"></b>
										</a>
			
								        <ul class="dropdown-menu" role="menu">
								            <li><a href="account"><i class="fa fa-user fa-fw"></i> Account</a></li>
											<li><a href="settings"><i class="fa fa-sliders fa-fw"></i> Einstellungen</a></li>
											<li class="divider hidden-xs"></li>
						    	            <li><a href ng-click="logout()"><i class="fa fa-sign-out fa-fw"></i> Abmelden</a></li>
						    	        </ul>
									</li>
						    	</ul>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<div class="external-ctrl" ui-view></div>
		</div>

		<div class="footer">
			<div class="container">
				<p class="left hidden-xs">
					<a href="<?php echo $config['representation-website']; ?>"><?php echo $config['representation-name']; ?></a>
				</p>
		
				<p class="right">
					<a href="contact" target="_self">Kontakt</a> |
					<a href="about" target="_self">Impressum</a>
				</p>
		
				<p class="center">
					<a href="/questions"><i class="fa fa-check-square-o"></i></a>
				</p>
			</div>
		</div>
	</body>
	
	<script>
		var body = document.getElementsByTagName('body')[0];
		body.style.visibility = 'visible';
		if (sessionStorage.fresh_login) {
			sessionStorage.removeItem('fresh_login');
			body.className = body.className + ' body-animated';
		}
		
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-47836301-1', 'crucio-leipzig.de');
		ga('send', 'pageview');
	</script>
	
	<script src="public/js/jquery.min.js"></script>
	<script src="public/js/bootstrap.min.js"></script>
	<script src="public/js/angular.min.js"></script>
	
	<!--script src="public/js/angular-route.min.js"></script-->
	<script src="public/js/angular-ui-router.min.js"></script>
	<script src="public/js/angular-sanitize.min.js"></script>
	<script src="public/js/angular-file-upload.min.js"></script>
	
	<script src="public/js/textAngular.min.js"></script>
	<script src="public/js/textAngularSetup.js"></script>
	<script src="public/js/loading-bar.min.js"></script>
	<script src="public/js/Chart.min.js"></script>
	<script src="public/js/tagmanager.js"></script>
	<script src="public/js/spin.js"></script>
	<script src="public/js/angles.js"></script>
	<script src="public/js/ui-bootstrap-tpls.min.js"></script>
	<script src="public/js/slider.js"></script>
	
	<script src="public/js/crucio.min.js"></script>
</html>