# Crucio

Crucio ist ein Online-Lernsystem für Multiple-Choice-Klausuren. Fachschaften können Alt- oder Probefragen eintragen und auf einfachem Wege allen Studierenden zur Verfügung stellen. Alle Informationen und einige Screenshots findet ihr auf der [Website](http://crucioproject.github.io). Crucio wird derzeit an der [Universität Leipzig](http://www.crucio-leipzig.de) verwendet.

Crucio ist Open Source und damit kostenlos verfügbar. Falls du/ihr/deine Fachschaft Crucio einführen wollt, könnt ihr unter Installation weiterlesen. Bei Fragen könnt ihr an crucio@pantorix.de schreiben!


## Fehler & Wünsche
Wenn ihr Fehler in Crucio gefunden habt, tragt sie bitte unter Issues ein. Dafür Danke! Ihr könnt dort ebenso Wünsche für neue Features eintragen und Crucio so mitgestalten.


## Installation
Falls du/ihr Crucio bei euch einführen möchtet, braucht ihr einen Server mit PHP und einer MySQL-Datenbank; diese kann man ab ca. 70€ im Jahr mieten. Folgende Schritte sind zur Installation notwendig:

1. Ladet dieses Repository z.B. unter `Download ZIP` auf der rechten Seite herunter.
2. Tragt in die Datei `config.example.php` im Ordner `app/api` eure Zugangsdaten für die MySQL-Datenbank ein und ändert den Namen in `config.php`.
3. Tragt in die Datei `config.example.json` im Ordner `app` eure Daten ein und ändert den Namen der Datei in `config.json`.
4. Installiert [NodeJS](https://nodejs.org), und führt dann `npm install` und `bower install` im Ordner aus. Ihr könnt dann über `gulp build` Crucio einrichten
5. Ladet über euren FTP-Zugang den Inhalt des Ordners `dist` auf euren Server hoch.
6. Ladet die leere MySQL-Datenbank `src/sql/database-structure.sql` in eure Datenbank hoch. 
 
Falls ihr Hilfe bei der Einrichtung und Wartung braucht, könnt ihr euch gerne melden.


## Entwicklung
Falls ihr Bugs entfernen oder neue Features einbauen möchtet, seid ihr herzlich dazu eingeladen! Ihr könnt euch gerne über crucio@pantorix.de melden, oder direkt Pull-Requests an den `dev`-Branch senden. Ein paar Hinweise zum Projekt:


### Programmiersprachen
Crucio ist in PHP, HTML, Javascript, [LESS](http://lesscss.org) und MySQL geschrieben.

### Frameworks
Die wichtigsten Frameworks, auf denen Crucio basiert, sind [AngularJS](https://angularjs.org), [Angular Material](http://material.angularjs.org) und [SLIM](http://www.slimframework.com). Für Icons wird [FontAwesome](http://fontawesome.io) verwendet.

### Workflow
Zur Entwicklung wird [Gulp](http://gulpjs.com) verwendet, den lokalen Webserver könnt ihr über `gulp serve` starten. Es muss zunächst [NodeJS](https://nodejs.org) installiert werden, danach könnt ihr alle Dependencies über die beiden Befehle `npm install` und `bower install` installiert werden. [Bower](http://bower.io) installiert die Dependencies für die Crucio selber.


### Code Style

Im gesamten Projekt wird CamelCase für Namen verwendet; ebenso 2-Space Tabs, Englisch als Sprache. Ansonsten sind als grobe Richtlinien
- [HTML / CSS](http://mdo.github.io/code-guide/#html-attribute-order)
- [JavaScript](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
- [AngularJS](https://github.com/mgechev/angularjs-style-guide/blob/master/README-de-de.md)
gedacht.


## Lizenz
Crucio ist steht unter der GNU GENERAL PUBLIC LICENSE Version 3.