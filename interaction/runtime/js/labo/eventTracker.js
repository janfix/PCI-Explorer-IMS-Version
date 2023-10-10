/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define([], function () {
    

    /** Collect event for TAO answering system - 
     * @param {string} evName - Event name
     * @param {obj} var1 object of event
     * @param {obj} var2 origin of object / location
     * @param {obj} var3 destination of object
     *Build the event string 
     Event List : 
        Navigation au clic depuis la liste 
         Double Clic dans liste- ouverture de [VERIFIER]

        Nagivation au clic depuis le Tree

        Drag and Drop
         Drag répertoire non sélectionné depuis la liste*
         Drag fichier non sélectionné depuis la liste
         Drag répertoire(s)  sélectionné(s) depuis la liste
         Drag fichier(s) sélectionné(s) depuis la liste
         Drag du répertoire depuis arborescence
         Drop de fichier exécuté
         Drop répertoire réalisé
         Drop Interdit

        Menu Contextuel
         Mcontextuel - Copier répertoire
         Mcontextuel - copie de répertoire
         Mcontextuel - Coller fichier depuis copier
         Mcontextuel - Copier fichier
         Mcontextuel - Couper répertoire
         Mcontextuel - Couper fichier
         Mcontextuel - Couper répertoire
         Mcontextuel ABANDON du Formatage du volume
         Mcontextuel - Création de répertoire
         Mcontextuel - Création de fichier
         Mcontextuel - ouvrir fichier
         Mcontextuel - Coller fichier depuis copier
         Mcontextuel - Coller fichier depuis couper
         Mcontextuel - Coller répertoire
         Mcontextuel - Renommage du répertoire
         Mcontextuel - Renommer le fichier
         Mcontextuel - Suppression de Répertoire
         Mcontextuel - Suppression de Répertoire vers corbeille
         Mcontextuel - Suppression de fichier vers corbeille
         Mcontextuel - Destruction définitive de fichier
         Mcontextuel Destruction définitive de répertoire
         Mcontextuel - Restaurer fichier de la corbeille
         Mcontextuel Restauration de répertoire


        Fichier texte
         Sauvegarde du fichier texte
         Fermeture du fichier texte sans sauvegarder

        Images
         Confirmation de la consultation de l'image liée au fichier

        Autres
         Consultation des propriétés du répertoire
         Formatage du volume
         Consultation des propriétés du fichier
       

     
     */

   

    function evCollector($container, evName, var1, var2, var3) {
        //console.log("EVENT ACT")
        //var evString = "{" + evName + ":{" + var1 + "," + var2 + "} }";
        var evString = '{ "Event" :"' + evName + '", "var1" : "' + var1 + '", "var2" :"'+var2+ '"}' 

        if(var1 =="-" && var2 =="-" ){
            //console.log("Parasite Event")
        }else {
        console.log(evString)
        $container.eventCollector.push(evString);
        console.log($container.eventCollector)
        $container.find(".dataActions").html($container.eventCollector.join(","));
        }
       
    }

    //******************************************** */
    //Collection of mini function usefull in all modules.

    /**DOUBLON DANS RENDERER A NETTOYER ! 
     * Get the name of a folder
     * @param {*} id 
     * @returns {string} name of directory
     */
    function getFolderName(id, treeFolder) {
        for (var i = 0; i < treeFolder.length; i++) {
            if (id == treeFolder[i].id) {
                var namer = treeFolder[i].text;
            }
        }
        return namer;
    }

    function storeFileState($container, mapFile) {
        $container.find(".dataFiles").html(JSON.stringify(mapFile));
    }

    function storeFolderState($container, treeFolder) {
        //console.log(treeFolder);
        $container.find(".dataTree").html(JSON.stringify(treeFolder));
    }

    /**ATTENTION EST DOUBLE TEMPORAIREMENT DANS RENDERER
     * Get date to complete info on creation file or folder.
     * @returns {date}  date of the day in a formated string
     */
    function nowDate() {
        var today = new Date();
        return today.toISOString().substring(0, 10).replace(/-/g, "/");
    }

    function storeClipBoard($container, clipBoard) {
        $container.find(".dataClipBoard").html(JSON.stringify(clipBoard));
    }

    /** branchSize calculate the virtual size (octets) of a jstree branch usually to determine if paste is possible (space available?) 
     * @returns  size of on branch root+children
     */
    function branchSize($tree, mapFile, targetFolderId) { // root of branch to copy
        var bSize = 0,rootNode, childNode;
        rootNode = $tree.jstree(true).get_node(targetFolderId);
        if (rootNode) {
            childNode = rootNode.children_d;
            if (childNode.indexOf(rootNode.id) === -1) {childNode.push(rootNode.id);} // add the branch's root to the array

            for (var i = 0; i < childNode.length; i++) {
                for (var y = 0; y < mapFile.length; y++) {
                    if (mapFile[y].node == childNode[i]) {
                        bSize = bSize + parseInt(mapFile[y].size);
                    }
                }
            }
        }
        if (!bSize) {
            bSize = 0
        }
        //console.log(bSize)
        return bSize;
    }

    function getVol(treeFolder, $tree, node) {
        var node_info = $tree.jstree("get_node", node);
        if (node_info) {
            //Two cases : normal folders and root folders
            var parents = [];

            if (node_info.data.type == "Volume" || node_info.data.type == "Mémoire Flash" || node_info.data.type == "Mémoire Flash usb") {
                parents.push(node_info.id);
            } else {
                parents = node_info.parents;
            }

            for (var i = 0; i < parents.length; i++) {
                for (var y = 0; y < treeFolder.length; y++) {
                    if (parents[i] == treeFolder[y].id && treeFolder[y].data.type == "Volume" ||
                        parents[i] == treeFolder[y].id && node_info.data.type == "Mémoire Flash" ||
                        parents[i] == treeFolder[y].id && node_info.data.type == "Mémoire Flash usb") {
                        return treeFolder[y].id;
                    }
                }
            }
        }

    }

    //************Modal windows functions******************************************/
    /**
     * change date format.
     * @param {date} isodate  Date in Iso format
     * @returns {date} the date in dd/mm/yyyy format
     */
    function fixEuroDate(isodate) {
        var eurodate;
        if (!isNaN(isodate[0])) {
            var dateObj = new Date(isodate);
            eurodate = ('0' + dateObj.getDate()).slice(-2) + '/' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '/' + dateObj.getFullYear();
        } else {
            eurodate = "-";
        }
        return eurodate;
    }






    return {
        collector: function ($container, evName, var1, var2, var3) {
            evCollector($container, evName, var1, var2, var3);
        },
        getDirName: function (id, treeFolder) {
            return getFolderName(id, treeFolder);
        },
        storeMapFile: function ($container, mapFile) {
            storeFileState($container, mapFile);

        },
        storeMapFolder: function ($container, treeFolder) {
            storeFolderState($container, treeFolder);
        },
        storeClipBoard: function ($container, clipBoard) {
            storeClipBoard($container, clipBoard);
        },
        getNowDate: function () {
            return nowDate();
        },
        branchSize: function ($tree, mapFile, targetFolderId) {
            var branchS = branchSize($tree, mapFile, targetFolderId);
            return branchS;
        },
        getVol: function (treeFolder, $tree, node) {
            var volRef = getVol(treeFolder, $tree, node);
            return volRef;
        },
        euroDate: function (isodate) {
            var edate = fixEuroDate(isodate);
            return edate;
        }

    };

});
//end Main function