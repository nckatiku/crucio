<?php $config = include('../php/config.php'); ?>

<html>
	<head>
		<link rel="stylesheet" href="../../public/css/crucio.min.css"/>
	</head>

	<body>
		<div class="wrap" style="margin-bottom: -57px;">
    		<div class="container container-top-bar" style="height: 64px;">
	    		<div class="row">
					<div class="col-xs-7 col-sm-8 col-md-10">
						<h1>
							<a href="http://<?php echo $config['website']; ?>">
								<i class="fa fa-check-square-o"></i> Crucio
							</a>
						</h1>
					</div>

					<div class="col-xs-5 col-sm-4 col-md-2">
			    		<a class="btn btn-block btn-index-top" href="http://<?php echo $config['website']; ?>">
				        	<i class="fa fa-sign-in fa-fw hidden-xs"></i> Anmelden
						</a>
					</div>
	    		</div>
    		</div>

			<div class="container-dark-orange container-padding-4">
				<div class="container container-text container-text-light">
    				<h4>Passwort zurücksetzen</h4>
    			</div>
			</div>

			<div class="container container-register">
				<div class="container">
					<strong>Hallo #USERNAME#,</strong><br><br>

					du hast uns eine Anfrage zum Zurücksetzen des Passwortes geschickt. Was willst du tun?

					<div class="row" style="margin:15px;margin-bottom: 40px;">
						<div class="col-xs-6 col-sm-4">
							<a class="btn btn-default btn-block" href="#CONFIRM-URL#">
								<i class="fa fa-check fa-fw"></i> Bestätigen
							</a>
						</div>
						<div class="col-xs-6 col-sm-4">
							<a class="btn btn-default btn-block" href="#DENY-URL#">
								<i class="fa fa-remove fa-fw"></i> Ablehnen
							</a>
						</div>
					</div>
					
					<br><br>

					Mit freundlichen Grüßen, <br><br>

					Crucio
				</div>
			</div>
		</div>

		<div class="footer">
			<div class="container">
				<p class="center">
					<a href="http://<?php echo $config['website']; ?>">Crucio</a> |
					<a href="http://<?php echo $config['representation-website']; ?>"><?php echo $config['representation-name']; ?></a>
				</p>
			</div>
		</div>
	</body>
</html>