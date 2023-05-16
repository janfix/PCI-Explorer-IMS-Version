/*
Copyright 2023 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.


The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define([], function () {

    function initTopMenu($container) {
        var menuTop = '<div class="container-fluid"> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> </div> <div class="navbar-collapse collapse"> <ul class="nav navbar-nav"> <li class="active"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Fichier <span class="caret"></span> </a> <ul class="dropdown-menu"> <li> <a href="#" class="formater noAction">Formater lecteur</a> </li> <li> <a href="#" class="noAction" >Gestion Espace</a> </li> </ul> </li> <li> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Affichage <span class="caret"></span> </a> <ul class="dropdown-menu"> <li> <a class="noAction" href="#">Grandes icônes</a> </li> <li> <a class="noAction" href="#">Petites icônes</a> </li> <li> <a class="noAction" href="#">Détails</a> </li> <li> <a class="noAction" href="#">Afficher les fichiers cachés</a> </li> </ul> </li> <li> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Recommencer<span class="caret"></span> </a> <ul class="dropdown-menu"> <li> <a class="totalRestart" href="#">Rétablir la configuration initiale</a> </li></ul> </div> <!--/.nav-collapse --> </div>';
        $container.find(".navbar").html(menuTop);
       

    }

    return {
        init: function ($container) {
            initTopMenu($container);
        }
    };

});
//end Main function