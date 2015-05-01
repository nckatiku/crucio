<?php $config = include('../php/config.php'); ?>

<html>
	<head>
		<link rel="stylesheet" href="../../public/css/crucio.min.css"/>
	</head>
	
	<body>
		<div class="wrap" style="margin-bottom: -57px;">
			<div class="container-white">
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
    		</div>

			<div class="container-dark-orange container-padding-4">
				<div class="container container-text container-text-light">
    				<h4>Kontaktanfrage</h4>
    			</div>
			</div>

			<div class="container container-register">
				<div class="container">
					<div class="row">
						<div class="col-xs-4">
							<i class="fa fa-user fa-fw"></i> #USERNAME#
						</div>
						<div class="col-xs-4">
							<i class="fa fa-envelope-o fa-fw"></i> #MAIL#
						</div>
						<div class="col-xs-4">
							<a href="mailto:#MAIL#" class="pull-right">
								<i class="fa fa-reply fa-fw"></i> Antworten
							</a>
						</div>
					</div>
				</div>

				<hr>

				<div class="container">
					#MESSAGE#
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
