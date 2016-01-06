<!DOCTYPE html>
<html ng-app="crucioApp" id="ng-app">
    <head>
        <?php include('parts/header.php'); ?>

        <title>Crucio</title>
    </head>

    <body class="body-padding">
        <div class="wrap">
            <nav class="navbar navbar-crucio navbar-fixed-top" role="navigation" ng-controller="LogoutController as logoutCtrl">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-5 col-md-4 col-md-offset-1">
                            <div class="navbar-header">
                                <button type="button" class="navbar-toggle" ng-click="isNavShown = !isNavShown">
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                </button>

                                <a class="navbar-brand" href="learn">
                                    <h1><i class="fa fa-check-square-o"></i>  Crucio</h1>
                                </a>
                            </div>
                        </div>

                        <div ng-if="logoutCtrl.user.username" class="col-sm-7">
                            <div class="collapse navbar-collapse" uib-collapse="!isNavShown">
                                <ul class="nav navbar-nav navbar-right">
                                    <li class="navbar-element" ng-class="{ 'active': logoutCtrl.Page.nav == 'Lernen' }">
                                        <a href="learn">Lernen</a>
                                    </li>

                                    <li class="navbar-element" ng-class="{ 'active': logoutCtrl.Page.nav == 'Autor' }" ng-if="logoutCtrl.user.group_id == 2 || logoutCtrl.user.group_id == 3">
                                        <a href="author">Autoren</a>
                                    </li>

                                    <li class="navbar-element" ng-class="{ 'active': logoutCtrl.Page.nav == 'Admin' }" ng-if="logoutCtrl.user.group_id == 2">
                                        <a href="admin">Admin</a>
                                    </li>

                                    <li ng-class="{active: logoutCtrl.Page.nav == 'Name'}" class="dropdown" uib-dropdown>
                                        <a role="button" href uib-dropdown-toggle>
                                            <span ng-bind="logoutCtrl.user.username"></span> <b class="caret"></b>
                                        </a>

                                        <ul class="dropdown-menu" role="menu">
                                            <li><a href="account"><i class="fa fa-user fa-fw"></i> Account</a></li>
                                            <li><a href="settings"><i class="fa fa-sliders fa-fw"></i> Einstellungen</a></li>
                                            <li class="divider hidden-xs"></li>
                                            <li><a href ng-click="logoutCtrl.logout()"><i class="fa fa-sign-out fa-fw"></i> Abmelden</a></li>
                                        </ul>
                                    </li>
                                 </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div ng-view class="external-ctrl"></div>
        </div>

        <div id="footer">
            <div class="container">
                <p class="left hidden-xs">
                    <a href="http://www.sturamed-leipzig.de">StuRaMed</a>
                </p>

                <p class="right">
                    <a href="help">Hilfe</a>
                </p>

                <p class="center">
                    <a><i class="fa fa-check-square-o"></i></a>
                </p>
            </div>
        </div>

        <?php include('parts/scripts.php'); ?>
    </body>
</html>