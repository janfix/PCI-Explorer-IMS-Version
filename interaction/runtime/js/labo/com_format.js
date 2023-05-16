/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/labo/eventTracker'], function (ev) {


    function cmdFormat($container, config, treeFolder, mapFile, $tree, volumeName, volumeId) {
       
        $container.find(".modali").css("height", "450px").show();
        $container.find('.modalTitle').remove();
        if (!volumeName) {
            $container.find(".contentModal").html('<h3>Formater un volume logique</h3><p>Nom du volume : <select class="volId"></select>' +
                '</p><p>Label : <input type="text"></p><p>Capacité : <input type="text"></p><p>Taille d\'unité d\'allocation : <input type="text"></p><p> Type de formatage : <select> <option value="FAT 32">FAT 32</option> <option value="exFAT" selected>exFAT</option> <option value="NFTS">NFTS</option><option value="HFS+">HFS+</option> </select> </p><button class="startFormat">Lancer le formatage</button><button class="annule">Annuler</button><div class="meter"><span></span></div><button disabled="disabled" class="doneClose">Fermer</button>');

            for (var i = 0; i < treeFolder.length; i++) {

                if (treeFolder[i].type == "volume" || treeFolder[i].type == "usb" || treeFolder[i].type == "sdCard") {
                    $container.find(".volId").append("<option class=" + treeFolder[i].id + ">" + treeFolder[i].text + "</option>");
                }
            }
        } else {
            $container.find(".contentModal").html('<h3>Formater un volume logique</h3><p>Nom du volume : <input disabled = "disabled" type="text" value="' + volumeName + '"></p><p>Label : <input type="text"></p><p>Capacité : <input type="text"></p><p>Taille d\'unité d\'allocation : <input type="text"></p><p> Type de formatage : <select> <option value="FAT 32">FAT 32</option> <option value="exFAT" selected>exFAT</option> <option value="NFTS">NFTS</option><option value="HFS+">HFS+</option> </select> </p><button class="startFormat">Lancer le formatage</button><button class="annule">Annuler</button><div class="meter"><span></span></div><button disabled="disabled" class="doneClose">Fermer</button>');
        }
        $container.find(".annule").on('click', function () {
            var evName = "Mcontextuel ABANDON du Formatage du volume";
            ev.collector($container, evName, "-", "-");
            $container.find(".modali").hide();
        });
        $container.find(".startFormat").on('click', function () {
            var evName;
            if (!volumeId) {
                volumeName = $container.find(".volId option:selected").text();
                volumeId = $container.find(".volId option:selected")[0].className;
            }
            var valideFormat = confirm("Attention vous allez formater le volume : " +
                volumeName + " ! Etes vous sûr ? l'ensemble des données seront perdues.")
            if (valideFormat) {
                for (var i = 0; i < mapFile.length; i++) {
                    if (mapFile[i].node == volumeId) {
                        mapFile[i].node = "erased";
                        ev.storeMapFile($container, mapFile);
                        if (volumeName.search("C:") >= 0) {
                            $container.find(".documents").hide();
                        };
                        if (volumeName.search("D:") >= 0) {
                            $container.find(".images").hide();
                            $container.find(".videos").hide();
                            $container.find(".downloads").hide();
                        };
                    }
                }
                for (var x = 0; x < treeFolder.length; x++) {
                    if (treeFolder[x].parent == volumeId) {
                        treeFolder[x].parent = 'erased';
                        $tree.jstree().move_node(treeFolder[x].id, 'erased');
                        ev.storeMapFolder($container, treeFolder);
                        ev.storeMapFile($container, mapFile);

                    }
                }
                $container.find(".meter").show();

                $container.find(".meter > span").show().each(function () {
                    $container.find(this)
                        .data("0%", $container.find(this).width())
                        .width(0)
                        .animate({
                            width: "100%"
                        }, 3000, function () {
                            alert("formatage terminé. Une erreur s'est produite. Restauration de l'état initial.")
                        });
                });

                /**Progress Bar */
                $container.find(".startFormat").attr('disabled', 'disabled');
                $container.find(".doneClose").attr('disabled', false);
                $container.find(".doneClose").on('click', function () {
                    $container.find(".modali").hide();
                    $tree.jstree('deselect_all');
                    $tree.jstree('select_node', 'root');
                    $tree.jstree('open_node', "root");
                })

                evName = "Formatage du volume";
                ev.collector($container, evName, ev.getDirName(volumeId, treeFolder), "-");
            }
        });

    } 
 
    return {
        format: function ($container, config, treeFolder, mapFile, $tree, volumeName, volumeId) {
            cmdFormat($container, config, treeFolder, mapFile, $tree, volumeName, volumeId);
        }
    };

});
//end Main function