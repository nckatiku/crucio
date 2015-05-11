<!DOCTYPE html>
<html id="ng-app" lang="de" ng-app="crucio.outside">
	<head>
		<?php include 'public/php/header.php'; ?>
		
		<title>Impressum | Crucio</title>
		
		<script>
			var module = angular.module('crucio.outside', []);
			module.controller('ctrl', function($scope) {
				// Check if user is in session storage
				if (angular.isDefined(sessionStorage.user)) {
					$scope.user = angular.fromJson(sessionStorage.user);
				}
			});
		</script>
	</head>

	<body class="body">
		<div class="wrap">
			<div class="container-top-bar" style="margin-bottom: 2px;" ng-controller="ctrl">
	    		<div class="container">
		    		<div class="row">
			    		<div class="col-sm-10">
				    		<h1><a href="/"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
			    		</div>

			    		<div class="col-sm-2">
				    		<a class="btn btn-index-top" href="/" ng-if="!user">
					        	<i class="fa fa-sign-in fa-fw"></i> Anmelden
							</a>
							
							<a class="btn btn-index-top" href="/questions" ng-if="user">
					        	<i class="fa fa-angle-left fa-fw"></i> Zurück
							</a>
			    		</div>
		    		</div>
	    		</div>
	    	</div>
	    	
			<div class="container-back-image container-padding-4">
				<div class="container container-text container-text-light">
	    			<i class="fa fa-info-circle fa-5x"></i>
	    			<h4>Impressum</h4>
	    			<p>
		    			Alles Rechtliche & Wichtige...
	    			</p>
	    		</div>
			</div>

			<div class="container-light-grey container-padding-2" style="padding-top:70px;">
				<div class="container">
					<dl class="dl-horizontal">
					    <dt>Inhaber</dt>
					    <dd>
					    	<address>
					    		<strong><?php echo $config['representation-name']; ?> <?php echo $config['city']; ?></strong><br>
								<?php echo $config['address']; ?><br>
								<?php echo $config['postcode']; ?> <?php echo $config['city']; ?><br>
					    	</address>
					    </dd>
					
					    <dt>Entwicklung</dt>
					    <dd>
					    	<address>
					    		Crucio ist ein Open-Source-Projekt. Weitere Infos gibt es auf der <a href="http://crucioproject.github.io">Hauptseite</a>. <strong>&copy; 2015 Lars Berscheid.</strong>
					    	</address>
					    </dd>
					</dl>
				</div>
			</div>
			
			<div class="container container-padding-2">
				<dl class="dl-horizontal">
				    <dt>Version</dt>
				    <dd>
				    	<address>
				    		Crucio ist noch in der <strong><span class="text-danger">0.7-Beta</span></strong>-Version, daher werdet ihr sicherlich einige Fehler entdecken. Die könnt ihr in <a href="https://github.com/crucioproject/Crucio/issues">Github</a> eintragen; und zwar möglichst so, dass wir den Fehler reproduzieren können. Oder euch einfach bei uns melden...
				    	</address>
				    </dd>

				    <dt>Disclaimer</dt>
				    <dd>
				    	<p>Sofern auf Links direkt oder indirekt verwiesen wird, die außerhalb des Verantwortungsbereiches des Autors liegen, haftet dieser nur dann, wenn er von den Inhalten Kenntnis hat und es ihm technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger Inhalte zu verhindern. Für darüber hinausgehende Inhalte und insbesondere für Schäden, die aus der Nutzung oder Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der über Links auf die jeweilige Veröffentlichung lediglich verweist. Diese Einschränkung gilt gleichermaßen auch für Fremdeinträge in vom Autor eingerichteten Gästebüchern, Diskussionsforen und Mailinglisten.</p>
				    </dd>

				    <dt>Datenschutz</dt>
				    <dd>
				    	<p>Diese Website nutzt Google Analytics, dabei werden Daten über den verwendeten Browsertyp/ -version, Betriebssystem, Referrer URL (die zuvor besuchte Seite), Hostname des zugreifenden Rechners (IP Adresse) und der Uhrzeit der Serveranfrage erhoben und verarbeitet. Diese Daten sind nicht bestimmten Personen zuordbar. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</p>
				    </dd>
				</dl>
			</div>
		</div>

		<?php require_once('public/php/footer.php'); ?>
	</body>
</html>