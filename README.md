# Crucio

Crucio ist ein Online-Lernsystem für Multiple-Choice-Klausuren. Fachschaften können Alt- oder Probefragen eintragen und auf einfachem Wege allen Studierenden zur Verfügung stellen. Alle Informationen und einige Screenshots findet ihr auf der [Website](http://crucioproject.github.io). Crucio wird derzeit an der [Universität Leipzig](http://www.crucio-leipzig.de) verwendet.

Crucio ist Open Source und damit kostenlos verfügbar. Falls du/ihr/deine Fachschaft Crucio einführen wollt, könnt ihr unter Installation weiterlesen. Bei Fragen könnt ihr an crucio@pantorix.de schreiben!


## Fehler & Wünsche
Wenn ihr Fehler in Crucio gefunden habt, tragt sie bitte unter Issues ein. Dafür Danke! Ihr könnt dort ebenso Wünsche für neue Features eintragen und Crucio so mitgestalten.


## Installation
Falls du/ihr Crucio bei euch einführen möchtet, braucht ihr einen Server mit PHP und einer MySQL-Datenbank; diese kann man ab 60€ im Jahr mieten. Folgende Schritte sind zur Installation notwendig:

1. Ladet dieses Repository z.B. unter `Download ZIP` auf der rechten Seite herunter.
2. Ladet über euren FTP-Zugang die Dateien aus dem Repository auf euren Server hoch. (Den `src`-Ordner braucht ihr dabei nicht hochzuladen.)
3. Tragt in die Datei `config.example.php` im Ordner `api` eure Zugangsdaten für die MySQL-Datenbank ein und ändert den Namen in `config.php`.
4. Ladet die leere MySQL-Datenbank aus `src/mysql` in eure Datenbank hoch. 
5. Ändert das Impressum in `about.php` auf euren Namen.
 
Falls ihr Hilfe bei der Einrichtung und Wartung braucht, könnt ihr euch gerne melden.


## Entwicklung
Falls ihr Bugs entfernen oder neue Features einbauen möchtet, seid ihr herzlich dazu eingeladen! Ihr könnt euch gerne über crucio@pantorix.de melden, oder direkt Pull-Requests an den `dev`-Branch senden. Ein paar Hinweise zum Projekt:


### Programmiersprachen
Crucio ist in PHP, HTML, Javascript, [LESS](http://lesscss.org) und MySQL geschrieben.

### Frameworks
Die wichtigsten Frameworks, auf denen Crucio basiert, sind [AngularJS](https://angularjs.org), [Bootstrap](http://getbootstrap.com) und [SLIM](http://www.slimframework.com). Für Icons wird [FontAwesome](http://fontawesome.io) verwendet.

### Workflow
Zur Entwicklung wird [Gulp](http://gulpjs.com) verwendet; hauptsächlich für den LESS-Compiler und für Minify- & Concat-Aktionen. Es muss zunächst [NodeJS](https://nodejs.org) installiert werden, danach kann Gulp über den Befehl `npm install -g gulp` installiert werden. Es müssen einmalig die benötigten Pakete für Crucio heruntergeladen werden (die in `package.json` aufgelistet sind), dies passiert über `npm install`. Über `gulp` wird dann eine Umgebung gestartet, bei der Änderungen sofort verarbeitet werden.

## Lizenz
Crucio ist steht unter der GNU GENERAL PUBLIC LICENSE Version 3.