<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
	<head>
		<?php include 'parts/header.php'; ?>
		<title>Impressum | Crucio</title>
	</head>

	<body class="body-padding" ng-controller="aboutCtrl">
		<div ng-include="'parts/navbar.html'"></div>

		<div class="wrap">
			<div class="container-white container-padding-4">
				<div class="container container-text container-text-dark">
	    			<i class="fa fa-info-circle fa-5x"></i>
	    			<h3>Impressum</h3>
	    			<p>
		    			Alles Rechtliche & Wichtige...
	    			</p>
	    		</div>
			</div>

			<div class="container-light-grey container-padding-2">
				<div class="container">
					<dl class="dl-horizontal">
					    <dt>Inhaber</dt>
					    <dd>
					    	<address>
					    		<strong>StuRaMed Leipzig</strong><br>
								Liebigstra�e 27<br>
								04103 Leipzig<br>
					    	</address>
					    </dd>
					
					    <dt>Entwicklung</dt>
					    <dd>
					    	<address>
					    		Crucio wurde entwickelt von <a href="http://www.pantorix.de">Pantorix</a>. <strong>&copy; 2015 Pantorix.</strong>
					    	</address>
					    </dd>
					</dl>
				</div>
			</div>
			
			<div class="container container-padding-2">
				<dl class="dl-horizontal">
				    <dt>Entwicklung</dt>
				    <dd>
				    	<address>
				    		Crucio ist noch in der <strong><span class="text-danger">0.6-Beta</span></strong>-Version, daher werdet ihr sicherlich einige Fehler entdecken. Die k�nnt ihr in <a href="https://github.com/crucioproject/Crucio/issues">Github</a> eintragen; und zwar m�glichst so, dass wir den Fehler reproduzieren k�nnen. Oder euch einfach bei uns melden...
				    	</address>
				    </dd>

				    <dt>Disclaimer</dt>
				    <dd>
				    	<p> Sofern auf Verweisziele ("Links") direkt oder indirekt verwiesen wird, die au�erhalb des Verantwortungsbereiches des Autors liegen, haftet dieser nur dann, wenn er von den Inhalten Kenntnis hat und es ihm technisch m�glich und zumutbar w�re, die Nutzung im Falle rechtswidriger Inhalte zu verhindern. F�r dar�ber hinausgehende Inhalte und insbesondere f�r Sch�den, die aus der Nutzung oder Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der �ber Links auf die jeweilige Ver�ffentlichung lediglich verweist. Diese Einschr�nkung gilt gleicherma�en auch f�r Fremdeintr�ge in vom Autor eingerichteten G�steb�chern, Diskussionsforen und Mailinglisten. </p>
				    </dd>

				    <dt>Datenschutz</dt>
				    <dd>
				    	<p> Diese Website nutzt Google Analytics, dabei werden Daten �ber den verwendeten Browsertyp/ -version, Betriebssystem, Referrer URL (die zuvor besuchte Seite), Hostname des zugreifenden Rechners (IP Adresse) und der Uhrzeit der Serveranfrage erhoben und verarbeitet. Diese Daten sind nicht bestimmten Personen zuordbar. Eine Zusammenf�hrung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. </p>
				    </dd>
				</dl>
			</div>
		</div>

		<?php require_once('parts/footer.php'); ?>
	</body>
</html>