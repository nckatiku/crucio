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
					<dl class="dl-horizontal">
						#MAIL_SUBJECT#

						<dt>Nachricht</dt>
						<dd>
							#MESSAGE#
						</dd>

						<dt>Zur Frage</dt>
						<dd>
							<strong>##QUESTION_ID#</strong> | #QUESTION#
						</dd>

						<dt>Klausur</dt>
						<dd>
							<strong>##EXAM_ID#</strong> | <i class="fa fa-flask fa-fw"></i> #SUBJECT# |  <i class="fa fa-calendar fa-fw"></i> #DATE2#
						</dd>

						<dt>Autor</dt>
						<dd>
							#AUTHOR#
						</dd>
					</dl>
				</div>

				<hr>

				<div class="row mtop">
					<div class="col-xs-6 col-sm-4">
						<a class="btn btn-default btn-block" href="http://<?php echo $config['website']; ?>/question?id=#QUESTION_ID#&reset_session=1">
							Frage ansehen
						</a>
					</div>
					<div class="col-xs-6 col-sm-4">
						<a class="btn btn-default btn-block" href="http://<?php echo $config['website']; ?>/edit-exam?id=#EXAM_ID#&question_id=#QUESTION_ID#">
							Frage bearbeiten
						</a>
					</div>
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
