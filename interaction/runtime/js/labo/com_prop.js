/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define([
    'exploPCI/interaction/runtime/js/labo/eventTracker', 
    'exploPCI/interaction/runtime/js/labo/util',
    'exploPCI/interaction/runtime/js/labo/free'
 ], function (ev, util, free) {

    function getProperties($container, config, treeFolder, mapFile, $tree, $fileList, selectedNode) {
         var evName;
         if (selectedNode) { // The node tree has been clicked

             $container.find(".fakeModalWindow").html('<div class="modalTitle"><div class="windowTools"></div></div>');
             $container.find(".modalTitle").css({
                 height: "37px",
                 opacity: "0.8"
             });
             $container.find('.windowTools').html(
                 '<div class="icoClose annulModal"></div>'
             );

             if (selectedNode[0].parent == "#") {
                 $container.find(".contentModal").html("<h1>Propriétés</h1>" +
                     "<ul class = 'nav nav-tabs'> <li class = 'active'> <a data-toggle = 'tab' href='#home'> Général </a></li> <li><a data-toggle = 'tab' href='#menu1'> Sécurité </a></li> <li> <a data-toggle = 'tab' href='#menu2'> Détails </a></li> </ul>" +
                     "<div class='tab-content'> <div id='home' class='tab-pane fade in active'> <h3>Localisation -> " + selectedNode[0].text + "</h3><p>Informations : <ul><li>Répertoire parent : - <li>Date de création : " + ev.euroDate(selectedNode[0].data.dateCreat) + "<li>Date de dernière modification : " + ev.euroDate(selectedNode[0].data.dateMod) + " </ul> </p> </div> <div id = 'menu1' class='tab-pane fade'><h3> Sécurité </h3> <p>Vous ne disposez pas des autorisations pour accéder à ces informations</p> </div> <div id='menu2' class='tab-pane fade'> <h3>Détails</h3> <p>Ce répertoire a été crée par</p><p> .... vous ne disposez pas des droits pour accéder à cette information.</p> </div> </div><button class='annulModal'>Fermer</button>");

             } else {
                 $container.find(".contentModal").html("<h1>Propriétés</h1>" +
                     "<ul class = 'nav nav-tabs'> <li class = 'active'> <a data-toggle = 'tab' href='#home'> Général </a></li> <li><a data-toggle = 'tab' href='#menu1'> Sécurité </a></li> <li> <a data-toggle = 'tab' href='#menu2'> Détails </a></li> </ul>" +
                     "<div class='tab-content'> <div id='home' class='tab-pane fade in active'> <h3>Localisation -> " + selectedNode[0].text + "</h3><p>Informations : <ul><li>Répertoire parent : " + ev.getDirName(selectedNode[0].parent, treeFolder) + "<li>Date de création : " + ev.euroDate(selectedNode[0].data.dateCreat) + "<li>Date de dernière modification : " + ev.euroDate(selectedNode[0].data.dateMod) + "<li>Capacité : " + util.byte(selectedNode[0].data.capacity) + "<li>Espace disponible : " + util.byte(free.freeSpace(treeFolder, mapFile, $tree, selectedNode[0])) + "</ul> </p> </div> <div id = 'menu1' class='tab-pane fade'><h3> Sécurité </h3 > <p> Vous ne disposez pas des autorisations pour accéder à ces informations </p> </div > <div id = 'menu2' class = 'tab-pane fade'> <h3> Détails </h3> <p>Ce répertoire a été crée par</p><p> ....vous ne disposez pas des droits pour accéder à cette information. </p> </div > </div><button class='annulModal'>Fermer</button > ");
             }

             $container.find(".modali").show().css({
                 width: "500px",
                 height: "500px"
             });
         } else {
             var SelectedArr = $fileList.rows({
                 selected: true
             })[0];
             var indexElement = SelectedArr[0];
             var element = $fileList.row(indexElement).data();
             if (SelectedArr.length == 0) {
                 alert("Aucun élément n'est sélectionné dans la liste.");
             } else {
                 if (element[3] == "Répertoire" || element[3] == "Mémoire Flash" || element[3] == "Lecteur Optique CD" || element[3] == "Mémoire Flash usb" || element[3] == "Volume") {
                     for (var i = 0; i < treeFolder.length; i++) {
                         if (treeFolder[i].id == element[0]) {
                             $container.find(".fakeModalWindow").html('<div class="modalTitle"><div class="windowTools"></div></div>');
                             $container.find('.windowTools').html(
                                 '<div class="icoClose annulModal"></div>'
                             );
                             $container.find(".modalTitle").css({
                                 height: "37px",
                                 opacity: "0.8"
                             });
                             $container.find(".contentModal").html("<h1>Propriétés</h1>" +
                                 "<ul class = 'nav nav-tabs'> <li class = 'active'> <a data-toggle = 'tab' href='#home'> Général </a></li> <li><a data-toggle = 'tab' href='#menu1'> Sécurité </a></li> <li> <a data-toggle = 'tab' href='#menu2'> Détails </a></li> </ul>" +
                                 "<div class='tab-content'> <div id='home' class='tab-pane fade in active'> <h3>Nom du répertoire : " + treeFolder[i].text + "</h3><p>Informations : <ul><li>Répertoire parent : " + ev.getDirName(treeFolder[i].parent,treeFolder) + "<li>Date de création : " + ev.euroDate(treeFolder[i].data.dateCreat) + "<li>Date de dernière modification : " + ev.euroDate(treeFolder[i].data.dateMod) + "<li>Capacité : " + util.byte(treeFolder[i].data.capacity) + "<li>Espace disponible : " + util.byte(treeFolder[i].data.freeSpace) + "</ul> </p> </div> <div id = 'menu1' class='tab-pane fade'><h3> Sécurité </h3> <p>Vous ne disposez pas des autorisations pour accéder à ces informations</p> </div> <div id='menu2' class='tab-pane fade'> <h3>Détails</h3> <p>Ce répertoire a été crée par</p><p> .... vous ne disposez pas des droits pour accéder à cette information.</p> </div> </div><button class='annulModal'>Fermer</button>");
                             $container.find(".modali").show().css({
                                 width: "500px",
                                 height: "500px"
                             });

                             evName = "Consultation des propriétés du répertoire";
                             ev.collector($container, evName, treeFolder[i].text, ev.getDirName(treeFolder[i].parent, treeFolder));
                         }
                     }
                 } else {
                     for (var i = 0; i < mapFile.length; i++) {
                         if (mapFile[i].fileId == element[0]) {
                             $container.find(".fakeModalWindow").html('<div class="modalTitle"><div class="windowTools"></div></div>');
                             $container.find('.windowTools').html(
                                 '<div class="icoClose annulModal"></div>'
                             );

                             $container.find(".modalTitle").css({
                                 height: "37px",
                                 opacity: "0.8"
                             });

                             $container.find(".contentModal").html("<h1>Propriétés</h1>" +
                                 "<ul class = 'nav nav-tabs'> <li class = 'active'> <a data-toggle = 'tab' href='#home'> Général </a></li> <li><a data-toggle = 'tab' href='#menu1'> Sécurité </a></li> <li> <a data-toggle = 'tab' href='#menu2'> Détails </a></li> </ul>" +
                                 "<div class='tab-content'> <div id='home' class='tab-pane fade in active'> <h3>Nom du fichier : " + mapFile[i].name + mapFile[i].extension + "</h3><p>Informations : <ul><li>Répertoire parent : " + ev.getDirName(mapFile[i].node, treeFolder) + "<li>Date de création : " + ev.euroDate(mapFile[i].dateCreat) + "<li>Date de dernière modification : " + ev.euroDate(mapFile[i].dateMod) + "<li>Date du dernier accès : " + ev.euroDate(mapFile[i].dateLastAcces) + "<li>Application associée : " + mapFile[i].app + "<li>Auteur : " + mapFile[i].author + "</ul> </p> </div> <div id = 'menu1' class='tab-pane fade'><h3> Sécurité </h3> <p>Vous ne disposez pas des autorisations pour accéder à ces informations</p> </div> <div id='menu2' class='tab-pane fade'> <h3>Détails</h3> <p>Ce répertoire a été crée par</p><p> .... vous ne disposez pas des droits pour accéder à cette information.</p> </div> </div><button class='annulModal'>Fermer</button>");
                             $container.find(".modali").show().css({
                                 width: "500px",
                                 height: "500px"
                             });

                             evName = "Consultation des propriétés du fichier";
                             ev.collector($container, evName, mapFile[i].name + mapFile[i].extension, ev.getDirName(mapFile[i].node, treeFolder));

                         }
                     }
                 }
             }
         }

         $container.find(".annulModal").click(function () {
             $container.find(".modali").hide();
         });

    }

    return {
        properties: function ($container, config, treeFolder, mapFile, $tree, $fileList, selectedNode) {
            getProperties($container, config, treeFolder, mapFile, $tree, $fileList, selectedNode);
        }
    };

});
//end Main function