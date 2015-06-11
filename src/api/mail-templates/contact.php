<?php $config = include('../php/config.php'); ?>

<html>
	<head>
		<link rel="stylesheet" href="../css/bootstrap.css"/>
		
		<style>
			
		body,
		html {
		  height: 100%;
		  font-family: 'Open Sans', sans-serif;
		  background-color: #ffffff;
		}
		.body-padding {
		  padding-top: 62px;
		}
		.wrap {
		  min-height: 100%;
		  height: auto;
		  margin: 0 auto -61px;
		  padding: 0 0 60px;
		}
		.row-slider {
		  margin: 8px;
		}
		.row-slider .ui-slider {
		  margin-top: 5px;
		}
		.row-slider .text-right {
		  text-align: right;
		}
		.container-padding-2 {
		  padding: 30px 0px;
		}
		.container-padding-4 {
		  padding: 60px 0px;
		}
		.container-padding-6 {
		  padding: 90px 0px;
		}
		.container-light-grey {
		  background-color: #eeeeee;
		}
		.container-dark-orange {
		  background-color: #d35400;
		}
		.container-top-bar {
		  padding-top: 9px;
		  padding-bottom: 2px;
		  margin-bottom: 0px;
		}
		.container-top-bar h1 {
		  margin-top: 6px;
		}
		.container-top-bar h1 a {
		  font-weight: 700;
		  color: #2c3e50;
		  font-family: 'Lato', sans-serif;
		  -o-transition: all .2s;
		  -moz-transition: all .2s;
		  -webkit-transition: all .2s;
		  -ms-transition: all .2s;
		  transition: all .2s;
		  padding: 13px;
		}
		.container-top-bar h1 a:hover {
		  text-decoration: none;
		  color: #ffffff;
		  background-color: #2c3e50;
		}
		.container-top-bar .element {
		  margin-bottom: 0px;
		}
		.container-top-bar .element .form-control {
		  font-family: 'Lato', 'Open Sans', sans-serif;
		  border: none;
		  border-radius: 0;
		  border-bottom: 2px solid #2c3e50;
		  box-shadow: none;
		}
		.container-top-bar .element .form-control:focus {
		  border: none;
		  box-shadow: none;
		  border-bottom: 2px solid #d35400;
		  outline: none;
		}
		.container-top-bar .element .form-control.has-error {
		  border: 2px solid #d35400;
		}
		.container-top-bar .element .checkbox {
		  margin-top: 3px;
		  margin-bottom: 0px;
		  padding-left: 20px;
		}
		.container-top-bar .element label {
		  margin-top: 0px;
		  font-size: 12px;
		  color: #2c3e50;
		  font-weight: normal;
		  font-family: 'Lato', sans-serif;
		}
		.container-top-bar .element label a {
		  color: #2c3e50;
		}
		.container-top-bar button,
		.container-top-bar a.btn {
		  margin-top: 7px;
		  margin-bottom: 6px;
		  color: #444444;
		  background-color: rgba(0, 0, 0, 0);
		  font-family: 'Lato', sans-serif;
		  border: 2px solid #2c3e50;
		  -o-transition: all .2s;
		  -moz-transition: all .2s;
		  -webkit-transition: all .2s;
		  -ms-transition: all .2s;
		  transition: all .2s;
		}
		.container-top-bar button:hover,
		.container-top-bar a.btn:hover {
		  color: #ffffff;
		  background-color: #2c3e50;
		}
		.container-text {
		  text-align: center;
		  font-family: 'Lato', sans-serif;
		}
		.container-text h4 {
		  letter-spacing: 0.2em;
		  text-transform: uppercase;
		  font-weight: 300;
		  padding-top: 26px;
		}
		.container-text p {
		  max-width: 780px;
		  font-weight: 300;
		  font-size: 15px;
		  line-height: 26px;
		  margin: 20px auto 0px auto;
		}
		.container-text a {
		  font-style: italic;
		}
		.container-text .btn-green {
		  border: 2px solid #d35400;
		  margin: 5px;
		  margin-top: 40px;
		  color: #d35400;
		  background-color: rgba(255, 255, 255, 0);
		  -o-transition: all .2s;
		  -moz-transition: all .2s;
		  -webkit-transition: all .2s;
		  -ms-transition: all .2s;
		  transition: all .2s;
		}
		.container-text .btn-green:hover {
		  color: #ffffff;
		  background-color: #d35400;
		}
		.container-text-light {
		  color: #eeeeee;
		}
		.container-text-dark {
		  color: #444444;
		}
		.brand {
		  margin: 20px auto;
		  text-align: center;
		  color: #ffffff;
		  font-family: 'Lato', 'Open Sans', sans-serif;
		}
		.brand h1 {
		  margin-top: 10px;
		  margin-bottom: 15px;
		  font-size: 70px;
		  font-weight: 700;
		}
		.brand p {
		  max-width: 600px;
		  margin: 30px auto;
		  line-height: 26px;
		  font-weight: 300;
		  letter-spacing: -0.25px;
		  font-size: 16px;
		}
		.brand .btn {
		  border: 2px solid #ffffff;
		  margin: 5px;
		  color: #ffffff;
		  -o-transition: all .2s;
		  -moz-transition: all .2s;
		  -webkit-transition: all .2s;
		  -ms-transition: all .2s;
		  transition: all .2s;
		}
		.brand .btn:hover {
		  color: #17971b;
		  background-color: #ffffff;
		}
		.image-med-exam {
		  margin-top: 0px;
		  margin-bottom: -90px;
		}
		.sturamed {
		  margin: 0px auto;
		  max-width: 260px;
		}
		.footer {
		  padding-top: 21px;
		  padding-bottom: 9px;
		  background-color: #2c3e50;
		  color: #eeeeee;
		  text-transform: uppercase;
		  font-size: 12px;
		  letter-spacing: 0.1em;
		  font-weight: 300;
		  font-family: 'Lato', sans-serif;
		}
		.footer .left {
		  float: left;
		  text-align: left;
		  width: 250px;
		}
		.footer .center {
		  text-align: center;
		}
		.footer .right {
		  float: right;
		  text-align: right;
		  width: 250px;
		}
		.footer a {
		  color: #ffffff;
		}
		.footer i {
		  font-size: 20px;
		}
		.strong {
		  font-weight: bold;
		}
		.mtop-navbar-row {
		  margin-top: 46px;
		}
		.mtop {
		  margin-top: 10px;
		}
		.mtop-2x {
		  margin-top: 20px;
		}
		.mtop-3x {
		  margin-top: 30px;
		}
		.mmtop {
		  margin-top: -10px;
		}
		.mbottom {
		  margin-bottom: 10px;
		}
		.mbottom-2x {
		  margin-bottom: 20px;
		}
		.mbottom-3x {
		  margin-bottom: 30px;
		}
		.mmbottom {
		  margin-bottom: -10px;
		}
		.dot {
		  border-radius: 50%;
		  height: 16px;
		  width: 16px;
		  margin: 5px;
		}
		.dot span {
		  margin-left: 25px;
		  margin-top: -2px;
		  position: absolute;
		}
		.dot.dot-success {
		  background-color: #5cb85c;
		}
		.dot.dot-danger {
		  background-color: #d9534f;
		}
		.dot.dot-info {
		  background-color: #5bc0de;
		}
		.dot.dot-warning {
		  background-color: #f0ad4e;
		}
		.container-center-align {
		  margin-top: 80px;
		  text-align: center;
		}
		.container-center-align .fa {
		  font-size: 192px;
		  color: #ddd;
		  margin: 20px;
		}
		.container-center-align hr {
		  margin: 20px;
		}
		.container-center-align-sm {
		  text-align: center;
		}
		.container-center-align-sm .fa {
		  font-size: 192px;
		  color: #ddd;
		  margin: 20px;
		}
		.btn-accent-color-2 {
		  color: #d35400;
		  background-color: #ffffff;
		  border: 2px solid #d35400;
		  -o-transition: all .2s;
		  -moz-transition: all .2s;
		  -webkit-transition: all .2s;
		  -ms-transition: all .2s;
		  transition: all .2s;
		}
		.btn-accent-color-2:hover,
		.btn-accent-color-2:focus,
		.btn-accent-color-2:active {
		  color: #ffffff;
		  background-color: #d35400;
		  border: 2px solid #d35400;
		}
		.form-control-out {
		  border: none;
		  border-radius: 0;
		  border-bottom: 2px solid #2c3e50;
		  box-shadow: none;
		}
		.form-control-out:focus {
		  border: none;
		  box-shadow: none;
		  border-bottom: 2px solid #d35400;
		  outline: none;
		}
		.form-control-out.has-error {
		  border: 2px solid #d35400;
		}
		</style>
	</head>
	
	<body>
		<div class="wrap">
			<div class="container-top-bar">
    			<div class="container">
	    			<div style="padding: 0px 30px; height: 56px;">
		    			<div class="pull-left">
				    		<h1><a href="http://<?php echo $config['website']; ?>"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
			    		</div>
			    		
						<div class="pull-right">
				    		<a class="btn btn-index-top" href="http://<?php echo $config['website']; ?>">
					        	<i class="fa fa-sign-in fa-fw"></i> Anmelden
							</a>
			    		</div>
	    			</div>
    			</div>
    		</div>

			<div class="container-dark-orange container-padding-2" style="padding-top: 10px;">
				<div class="container container-text container-text-light">
    				<h4>Kontaktanfrage</h4>
    			</div>
			</div>

			<div class="container-padding-4">
				<div class="container">
					<div class="row">
						<div class="col-xs-4">
							<i class="fa fa-user fa-fw"></i> #USERNAME#
						</div>
						<div class="col-xs-4">
							<i class="fa fa-envelope-o fa-fw"></i> #MAIL#
						</div>
						<div class="col-xs-4">
							<a class="pull-right" href="mailto:#MAIL#">
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
