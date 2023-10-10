/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/lib/datatables',
        'exploPCI/interaction/runtime/js/labo/eventTracker',
        'exploPCI/interaction/runtime/js/assets',
        'exploPCI/interaction/runtime/js/core/displayDirContent'
        ], function ($, ev, assets, displayDirContent) {


    function open($container, config, treeFolder, mapFile, $tree,  $fileList) {
        var evName;
        var SelectedArr = $fileList.rows({
            selected: true
        })[0];
        //if (SelectedArr.length == 0) {
            //alert("Aucun fichier ou répertoire n'a été sélectionné. Sélectionner d'abord un élément de la liste ou double cliquer sur l'élément pour l'ouvrir")
        //} else {
            var indexElement = SelectedArr[0];
            var element = $fileList.row(indexElement).data();
            // test File or Folder ?
            if (element[3] == "Répertoire" || element[3] == "Mémoire Flash" || element[3] == "Lecteur Optique CD" || element[3] == "Mémoire Flash usb" || element[3] == "Volume") {
                $tree.jstree('deselect_all');
                $tree.jstree('select_node', element[0]);
                $tree.jstree('open_node', element[0]);
            } else { //file
                for (var i = 0; i < mapFile.length; i++) {
                    if (element[0] == mapFile[i].fileId) {
                        evName = "Mcontextuel - ouvrir fichier";
                        ev.collector($container, evName, mapFile[i].name + mapFile[i].extension, ev.getDirName(mapFile[i].node, treeFolder));
                        fileCall($container,  
                            config,
                            treeFolder, 
                            mapFile, 
                            $tree, 
                            mapFile[i].name + mapFile[i].extension, 
                            $tree.jstree(true).get_selected(),
                            $fileList
                            ); //file name + activDir
                    };
                }
            }
        //}
    }

    function fileCall($container, config, treeFolder, mapFile, $tree, targetName, targetPlace,$fileList) {
        var evName;
        for (var i = 0; i < mapFile.length; i++) {
            var filetname = mapFile[i].name + mapFile[i].extension;
            if (filetname == targetName && mapFile[i].node == targetPlace) {
                mapFile[i].dateLastAcces = ev.getNowDate();
                var appImgUrl = mapFile[i].image_url;
                if (!appImgUrl) {
                    appImgUrl = assets.processing;
                }

                if (mapFile[i].extension == ".txt" || mapFile[i].extension == ".doc" || mapFile[i].extension == ".docx") {

                    var indexMap = i;

                    if (mapFile[i].content) {
                        var content = mapFile[i].content
                    }
                    if (!content) {
                        content = " "
                    }

                    $container.find(".modalApp").show().css({
                        width: "700px",
                        height: "530px",
                        padding: "10px",
                        "text-align": "center"
                    });
                    
                    $container.find('.windowToolbar').html(
                        '<div class="windowTools"><div class="icoClose closeWindow"></div></div>'
                    ).hide();
                    $container.find(".contentModalApp").addClass("imageAppContainer");
                    var editorID = '_' + Math.random().toString(36).substr(2, 9);
                    $container.find(".contentModalApp").html("<textarea class='richContent' cols='300' id=" + editorID + ">" + content + "</textarea><img class='waitIcon' src= " + assets.Loading_icon + ">");
                    $container.find('.richContent').richText();
                    $container.find('.richText-toolbar').hide();
                    $container.find('.richText').prepend('<div class="fakeToolBar"></div>')
                    $container.find('.nicEdit-panelContain').parent().width('100%');
                    $container.find('.nicEdit-panelContain').parent().next().width('98%');
                    $container.find('.nicEdit-panelContain').parent().next().height('250px');
                    $container.find('.nicEdit-main').width('98%');

                    $container.find(".waitIcon").hide();
                    $container.find('.windowToolbar').show();
                    $container.find(".contentModalApp").append("<button class='saveTxt butcloser'>Sauvegarder et fermer</button><button class='annulModal butcloser'>fermer sans sauvegarder</button>")
                    $container.find(".annulModal").click(function () {
                        $container.find(".modalApp").hide();
                        $container.find(".saveTxt").remove();
                        evName = "Fermeture du fichier texte sans sauvegarder";
                        ev.collector($container,evName, mapFile[indexMap].name, mapFile[indexMap].content);
                    });


                    $container.find(".saveTxt").click(function txtSaver(params) {
                        mapFile[indexMap].dateMod = ev.getNowDate();

                        mapFile[indexMap].content = $container.find(".richText-editor")[0].innerText;
                        mapFile[indexMap].size = mapFile[indexMap].content.length / 10;
                        ev.storeMapFile($container, mapFile);
                        evName = "Sauvegarde du fichier texte";
                        ev.collector($container, evName, mapFile[indexMap].name, mapFile[indexMap].content);
                        $container.find(".modalApp").hide();
                        $container.find(".saveTxt").remove();
                        $tree.jstree(true).open_node(mapFile[indexMap].node);
                        console.log($fileList)
                        displayDirContent.now($container, config, targetPlace, $fileList, $tree, mapFile);
                    })

                    $container.find(".closeWindow").click(function () {
                        $container.find(".modalApp").hide();
                        $container.find(".saveTxt").remove();
                    });

                } else if (isURL(appImgUrl)) {
                    var indexMap = i;

                    $container.find(".modalApp").show().css({
                        width: "1000px",
                        height: "550px"
                    });
                    $container.find('.windowToolbar').html(
                        '<div class="windowTools"><div class="icoClose closeWindow"></div></div>'
                    );
                    $container.find('.windowToolbar img').addClass('closeWindow');
                    $container.find(".contentModalApp").addClass("imageAppContainer");
                    $container.find(".contentModalApp").html("<button class='annulModal topButtonCloser'>Fermer l'application et retourner à l'explorateur de fichiers</button><img class='imageApp' src=" + appImgUrl + ">");

                    $container.find(".annulModal").click(function () {
                        $container.find(".modalApp").hide();
                        evName = "Confirmation de la consultation de l'image liée au fichier";
                        ev.collector($container, evName, mapFile[indexMap].name + mapFile[indexMap].extension, ev.getDirName(mapFile[indexMap].node, treeFolder));

                    });

                    $container.find(".closeWindow").click(function () {
                        $container.find(".modalApp").hide();
                    });

                } else if (mapFile[i].extension == ".js" ||
                    mapFile[i].extension == ".xls" ||
                    mapFile[i].extension == ".doc" ||
                    mapFile[i].extension == ".ppt") {
                    $container.find(".modali").show().css({
                        width: "500px",
                        height: "500px"
                    });
                    $container.find(".windowTools").hide();
                    $container.find(".contentModal").html('<br /><hr><h2>Vous venez de lancer l\'application permettant d\'ouvrir ce fichier.</h2><img class="processing" width="430px" src="' + assets.processing + '"/><button class="annulModal">Retourner à l\'explorateur de fichiers</button>');
                    $container.find(".annulModal").click(function () {
                        $container.find(".modali").hide();
                    });
                } else {
                    alert("Aucune application n'est associée à ce type de fichier.");
                }

            }
        }

    }

    /**
     * Check if the string is a URL : determine if a distant image is associated to a file.
     * @param {string} str check url data for a file
     */
    function isURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }


    return {
        open: function ($container, config, treeFolder, mapFile, $tree, $fileList,fileType) {
            open($container, config,  treeFolder, mapFile, $tree, $fileList,fileType);
        },
        fileCall: function ($container, config, treeFolder, mapFile, $tree, targetName, targetPlace,$fileList ) {
            console.log($fileList)
            fileCall($container, config,  treeFolder, mapFile, $tree,  targetName, targetPlace,$fileList );
        }
    };

});
//end Main function