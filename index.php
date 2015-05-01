<!DOCTYPE html>
<!-- ID NG-App for Internet Explorer Support -->
<html ng-app="crucioApp" id="ng-app">
	<head>
		<?php include 'parts/header.php'; ?>
		<title>Crucio | Fachschaft Medizin <?php echo $config['city'] ?></title>
		
		<script> smoothScroll.init(); </script>
	</head>

	<body class="body">
	    <div class="wrap">
	    	<div class="container-top-bar" ng-controller="loginCtrl" style="margin-bottom: 0px;">
	    		<div class="container">
		    		<form class="row" ng-submit="login()">
			    		<div class="col-md-4 col-md-offset-1">
							<h1><a href="/"><i class="fa fa-check-square-o"></i> Crucio </a></h1>
			    		</div>

			    		<div class="col-md-3">
				    		<div class="form-group element has-feedback {{login_error ? 'has-error' : ''}}">
	        		    	    <input class="form-control" ng-model="email" type="email" placeholder="E-Mail-Adresse" autofocus>
	        		    	    <label class="checkbox">
				        			<input type="checkbox" ng-model="remember_me" ng-true-value="1" ng-false-value="0" style="margin-top:2px;">
				        			Angemeldet bleiben
								</label>
	        		    	</div>
			    		</div>

			    		<div class="col-md-2">
				    		<div class="form-group element has-feedback {{login_error ? 'has-error' : ''}}">
	        		    	    <input class="form-control" ng-model="password" type="password" placeholder="Passwort">
	        		    	    <i class="fa fa-remove form-control-feedback" ng-show="login_error" style="margin-top:9px;"></i>
	        		    	    <label for="passwordInput">
	        		    	    	<a href="forgot-password" target="_self">Passwort vergessen?</a>
	        		    	    </label>
	        		    	</div>
			    		</div>

			    		<div class="col-md-1">
				    		<button class="btn btn-index-top">
					        	<i class="fa fa-sign-in fa-fw hidden-xs"></i> Anmelden
							</button>
			    		</div>
		    		</form>
	    		</div>
	    	</div>

	    	<div class="container-back-image container-padding-6">
	    		<div class="container">
	    			<div class="brand">
					    <h1><i class="fa fa-check-square-o"></i> Crucio<span ng-show="is_dev">Dev</span></h1>
					    
					    <p>... hilft dir bei der Vorbereitung f�r Medizinklausuren an der Universit�t <?php echo $config['city'] ?>.
							Hier werden �bungsfragen aus dem Studium gesammelt, gekreuzt und erkl�rt.</p>
						
						<a class="btn btn-lg" href="register" target="_self">Registrieren</a>
				        <a class="btn btn-lg" data-scroll href="#more" target="_self">Mehr Infos</a>
					</div>
				</div>

				<img src="public/images/med_3x.png" class="center-block img-responsive image-med-exam">
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

	    	<div class="container-dark-orange container-padding-6">
				<div class="container container-text container-text-light">
					<i class="fa fa-magic fa-5x"></i>
					<h4>Noch nicht registriert?</h4>
					<p>Auf gehts, Crucio ist seit kurzem freigeschaltet! Wenn du gar nicht in <?php echo $config['city'] ?> studierst, dann kannst du uns gerne mal anschreiben, vielleicht k�nnen wir dir helfen...</p>
				</div>
			</div>
	    </div>

	    <?php include 'parts/footer.php'; ?>
	</body>
</html>