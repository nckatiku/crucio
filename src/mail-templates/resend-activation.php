<?php $config = include('../php/config.php'); ?>

<html>
	<head>
		<link rel="stylesheet" href="../../public/css/crucio.min.css"/>
	</head>

	<body>
		<div class="wrap" style="margin-bottom: -57px;">
    		<div class="container container-top-bar" style="height: 64px;">
	    		<div class="row">
					<div class="col-sm-9">
						<h1><a href="http://<?php echo $config['website']; ?>"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
			    	</div>
			    	
					<div class="col-sm-2">
						<a class="btn btn-index-top" href="http://<?php echo $config['website']; ?>">
				        	<i class="fa fa-sign-in fa-fw"></i> Anmelden
						</a>
			    	</div>
	    		</div>
    		</div>

			<div class="container-dark-orange container-padding-4">
				<div class="container container-text container-text-light">
    				<h4>Willkommen</h4>
    			</div>
			</div>

			<div class="container-padding-4">
				<div class="container">
					<strong>Hey #USERNAME#,</strong><br><br>

					du hast nach einem neuen Link für die Aktivierung deines Accounts gefragt. Here we go:

					<div class="row" style="margin:15px;">
						<div class="col-sm-4">
							<a class="btn btn-default" href="#ACTIVATION-URL#">
								<i class="fa fa-check fa-fw"></i> Account aktivieren
							</a>
						</div>
					</div>

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