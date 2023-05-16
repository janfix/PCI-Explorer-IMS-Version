/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/labo/eventTracker',
        'exploPCI/interaction/runtime/js/labo/verifDbl',
        'exploPCI/interaction/runtime/js/labo/free',
        'exploPCI/interaction/runtime/js/core/displayDirContent'
    ],
    function(exv, verifDbl, free, displayDirContent) {
        var DDFile = [],
            DDFolder = [];

        /**Drag function For Firefox -> files and folders list */
        function dnd_dragFF($container, config, treeFolder, mapFile, $fileList, ev) {
            //console.log(" Called by DragStart -> Drag manager")
            DDFolder = [];
            DDFile = [];
            var FileArray = [],
                evName;
            //console.log(ev.data)
            for (let i = 0; i < ev.data.length; i++) {
                if (ev.data[i][3] == "Répertoire") {
                    DDFolder.push(ev.data[i][0]);
                    evName = "Drag répertoire depuis la liste";
                } else {
                    DDFile.push(ev.data[i][0])
                    evName = "Drag fichier depuis la liste";
                }

            }

            ev.originalEvent.dataTransfer.setData("text/plain", ev.target.id);
            //identification element grabbed by just mouseDown and not click
            var ddTarget, nameCheck, idCheck, typeCheck;
            idCheck = ev.target.getAttribute('data');
            //console.log(idCheck)
            nameCheck = ev.target.cells[0].innerText;
            typeCheck = ev.target.cells[2].innerText;


            /* if (typeCheck == 'Répertoire') { // Identify mousedown on folder
                for (var i = 0; i < treeFolder.length; i++) {
                    if (treeFolder[i].id == idCheck) {
                        treeFolder[i].origin = treeFolder[i].parent;
                        //DDFolder.push(treeFolder[i].id);
                        //DDFolder.indexOf(treeFolder[i].id) === -1 ? DDFolder.push(treeFolder[i].id) : false;
                        //exv.collector($container, evName, treeFolder[i].text, exv.getDirName(treeFolder[i].parent, treeFolder));
                    }
                }
            } else {
                // Identify mousedown on file
                for (var i = 0; i < mapFile.length; i++) {
                    if (mapFile[i].fileId == idCheck) {
                        mapFile[i].origin = mapFile[i].node;
                        DDFile.push(mapFile[i].fileId);
                        evName = "Drag fichier depuis la liste";
                        //exv.collector($container, evName, mapFile[i].name + mapFile[i].extension, exv.getDirName(mapFile[i].origin, treeFolder));
                    };
                }
            } */



            ddTarget = $fileList.rows({
                selected: true
            })[0];

            /*  if (ddTarget.length == 0) {
                 alert("Attention aucun élément de la liste n'est sélectionné. Veillez à manipuler une/des lignes grisée(s)");
                 return
             } */

            for (var i = 0; i < ddTarget.length; i++) {
                var dataId = $fileList.row(ddTarget[i]).data()[0];
                var chain = $fileList.row(ddTarget[i]).data();
                if (chain.includes("Répertoire")) {
                    for (var i = 0; i < treeFolder.length; i++) {
                        if (treeFolder[i].id == dataId) {
                            treeFolder[i].origin = treeFolder[i].parent;
                            evName = "Drag répertoire(s)  sélectionné(s) depuis la liste";
                            //exv.collector($container, evName, treeFolder[i].text, exv.getDirName(treeFolder[i].origin, treeFolder));
                        };
                    }

                    if (DDFolder.indexOf(dataId) === -1) {
                        DDFolder.push(dataId)
                    }
                } else {
                    FileArray.push(dataId); // Build file array selection
                }
            }

            // File selected : list builder 
            for (var y = 0; y < FileArray.length; y++) {
                for (var i = 0; i < mapFile.length; i++) {
                    if (mapFile[i].fileId == FileArray[y]) {
                        mapFile[i].origin = mapFile[i].node;
                        evName = "Drag fichier(s) sélectionné(s) depuis la liste";
                        //exv.collector($container, evName, mapFile[i].name + mapFile[i].extension, exv.getDirName(mapFile[i].origin, treeFolder));

                        if (DDFile.indexOf(FileArray[y]) === -1) {
                            DDFile.push(FileArray[y])
                        }
                    };
                }
            }
            return [idCheck, nameCheck, typeCheck];

        }

        /**Drag Commun for Chrome & alii except firefox  */
        function dnd_drag($container, config, treeFolder, mapFile, $fileList, ev) {
            var FileArray = [],
                evName;
            DDFile = [];
            ev.dataTransfer.setData("text/plain", ev.target.id);
            //identification element grabbed by just mouseDown and not click
            var ddTarget, nameCheck, idCheck, typeCheck;
            idCheck = ev.target.getAttribute('data');
            nameCheck = ev.target.cells[0].innerText;
            typeCheck = ev.target.cells[2].innerText;

            if (typeCheck == 'Répertoire') { // Identify mousedown on folder
                for (var i = 0; i < treeFolder.length; i++) {
                    if (treeFolder[i].id == idCheck) {
                        treeFolder[i].origin = treeFolder[i].parent;
                        DDFolder.push(treeFolder[i].id);
                        evName = "Drag répertoire non sélectionné depuis la liste";
                        //exv.ollector($container, evName, treeFolder[i].text, exv.getDirName(treeFolder[i].parent, treeFolder));
                    }
                }
            } else {
                // Identify mousedown on file
                for (var i = 0; i < mapFile.length; i++) {
                    if (mapFile[i].fileId == idCheck) {
                        mapFile[i].origin = mapFile[i].node;
                        DDFile.push(mapFile[i].fileId);
                        evName = "Drag fichier non sélectionné depuis la liste";
                        //exv.collector($container, evName, mapFile[i].name + mapFile[i].extension, exv.getDirName(mapFile[i].origin), treeFolder);
                    };
                }
            }

            ddTarget = $fileList.rows({
                selected: true
            })[0];



            for (var i = 0; i < ddTarget.length; i++) {
                var dataId = $fileList.row(ddTarget[i]).data()[0];
                var chain = $fileList.row(ddTarget[i]).data();
                if (chain.includes("Répertoire")) {
                    for (var i = 0; i < treeFolder.length; i++) {
                        if (treeFolder[i].id == dataId) {
                            treeFolder[i].origin = treeFolder[i].parent;
                            evName = "Drag répertoire(s)  sélectionné(s) depuis la liste";
                            //exv.collector($container,evName, treeFolder[i].text, exv.getDirName(treeFolder[i].origin, treeFolder));
                        };
                    }

                    if (DDFolder.indexOf(dataId) === -1) {
                        DDFolder.push(dataId)
                    }
                } else {
                    FileArray.push(dataId); // Build file array selection
                }
            }

            // File selected : list builder 
            for (var y = 0; y < FileArray.length; y++) {
                for (var i = 0; i < mapFile.length; i++) {
                    if (mapFile[i].fileId == FileArray[y]) {
                        mapFile[i].origin = mapFile[i].node;
                        evName = "Drag fichier(s) sélectionné(s) depuis la liste";
                        //exv.collector($container, evName, mapFile[i].name + mapFile[i].extension, exv.getDirName(mapFile[i].origin, treeFolder));

                        if (DDFile.indexOf(FileArray[y]) === -1) {
                            DDFile.push(FileArray[y])
                        }
                    };
                }
            }
        }

        /** Drop function From List to Tree - no browser compatibilty problem */
        function dnd_drop($container, config, treeFolder, mapFile, $tree, $fileList, incrementor, ev) {

            var activDir = $tree.jstree(true).get_selected(),
                evName; /**get activ Directory */
            var testDoublon = false; // OK verified
            /**
             * Drag and drop folder from list : define destination 
             * Two moves : 1.from list to list  2.from list to tree 
             * Is drop allowed?
             * @param {obj} evTarget - the destination folder containing destination folder id. 
             */
            function defineTargetFolder(evTarget) {
                var targetId;
                if (evTarget.find(".secretId").context.innerText == "Cet Ordinateur") {
                    targetId = "root"
                } // from the list to the list
                else if (evTarget.find(".secretId").context.innerText == "Lecteur CD/DVD") {
                    targetId = "cdRom"
                } else if (evTarget.find(".secretId").context.innerText == "Réseau Local") {
                    targetId = "netWork"
                } else {
                    if (typeof evTarget.find(".secretId")[0] !== "undefined") { // From the list to the list
                        targetId = evTarget.find(".secretId")[0].innerText
                    } else { // from the list to the tree folder 
                        var evtstring = String(ev.target.id);
                        targetId = evtstring.substring(0, evtstring.length - 7);
                    }

                }
                return targetId
            }

            ev.preventDefault();
            $fileList.rows('.selected').remove().draw();
            if (DDFile.length > 0) {
                for (var y = 0; y < DDFile.length; y++) {
                    /**Look throught Drag file array */
                    var targetFileId = DDFile[y];
                    for (var i = 0; i < mapFile.length; i++) {
                        /**Look throught Json Files */
                        if (targetFileId == mapFile[i].fileId) {
                            /** Scan to find file in MapFile*/
                            for (var x = 0; x < treeFolder.length; x++) {
                                /**Look throught Json Directories to fix autorization to write on volume */
                                var evtstring = String(ev.target.id);

                                evtstring = evtstring.substring(0, evtstring.length - 7);
                                if (treeFolder[x].id == evtstring) {



                                    if (treeFolder[x].id == "cdRom" || treeFolder[x].id == "root" || treeFolder[x].id == "netWork") {
                                        alert("Opération interdite - il est impossible d'écrire sur cet emplacement");
                                        $tree.jstree().deselect_all();
                                        $tree.jstree().select_node(mapFile[i].node);
                                        DDFile = [];
                                        evName = "Drop Interdit";
                                        exv.collector($container, evName, mapFile[i].name + mapFile[i].extension, treeFolder[x].text);
                                        return;
                                    } else {
                                        verifDbl.verif(treeFolder, mapFile, $tree, incrementor, mapFile[i], treeFolder[x].id, "DD");
                                        exv.storeMapFile($container, mapFile);
                                        evName = "Drop de fichier exécuté";
                                        exv.collector($container, evName, mapFile[i].name + mapFile[i].extension, treeFolder[x].text);
                                    }
                                } else {
                                    /** Drop files to a directory but in the list not in the tree*/
                                    var evtstring = String(ev.target.id);
                                    evtstring = evtstring.substring(0, evtstring.length - 7);
                                    if (DDFile[y] == mapFile[i].fileId) {
                                        if ($(ev.target).find(".secretId")[0]) {
                                            if (treeFolder[x].id == $(ev.target).find(".secretId")[0].innerText || treeFolder[x].id == evtstring) {
                                                // Check if present in destination
                                                verifDbl.verif(treeFolder, mapFile, $tree, incrementor, mapFile[i], treeFolder[x].id, "DD");
                                                evName = "Drop de fichier exécuté";
                                                exv.collector($container, evName, mapFile[i].name + mapFile[i].extension, treeFolder[x].text);
                                            }
                                        } else {
                                            if (treeFolder[x].id == evtstring) {
                                                verifDbl.verif(treeFolder, mapFile, $tree, incrementor, mapFile[i], treeFolder[x].id, "DD");
                                                evName = "Drop de fichier exécuté";
                                                exv.collector($container, evName, mapFile[i].name + mapFile[i].extension, treeFolder[x].text);
                                            }
                                        }

                                        exv.storeMapFile($container, mapFile);
                                    }

                                }
                            }
                        }
                    }
                }
                $tree.jstree(true).select_node(activDir);
                $tree.jstree(true).open_node(activDir);


                DDFile = [];
                return "ciblos";
            }
            if (DDFolder.length > 0) {
                var cblFolderId = defineTargetFolder($(ev.target));
                for (var y = 0; y < DDFolder.length; y++) {
                    /**Look throught Drag file array */
                    var targetFolderId = DDFolder[y];
                    WbranchSize = exv.branchSize($tree, mapFile, targetFolderId);
                    for (var i = 0; i < treeFolder.length; i++) {
                        /**Look throught Json Folders */
                        if (targetFolderId == treeFolder[i].id) {
                            /**Find Folder To move in TreeFolder */
                            for (var x = 0; x < treeFolder.length; x++) {
                                /**Look throught Json Directories */
                                var procy = true;
                                if (cblFolderId !== "Normalfolder") {
                                    /**Drop Folder from the list to the list */
                                    if (treeFolder[x].id == cblFolderId) {
                                        if (treeFolder[x].id == "cdRom" || treeFolder[x].id == "root" || treeFolder[x].id == "netWork") {
                                            /**Exclusion of CdRom */
                                            alert("Opération interdite - il est impossible d'écrire sur cet emplacement");
                                            targetFolderId = toString(treeFolder[x].id);
                                            $tree.jstree().deselect_all();
                                            $tree.jstree().select_node(treeFolder[i].parent);

                                            evName = "Drop répertoire Interdit";
                                            exv.collector($container, evName, getDirName(DDFolder[y], treeFolder), exv.getDirName(treeFolder[x].id, treeFolder));
                                        } else {
                                            //if (testFreeSpaceFolder(treeFolder[x].id, WbranchSize)) {
                                            if (free.testSpaceFolder(treeFolder, mapFile, $tree, treeFolder[x].id, WbranchSize)) {
                                                $tree.jstree().move_node(targetFolderId, treeFolder[x].id); /**Move roots of branch (and the branch) from clipboard to destination  */
                                            } else {
                                                alert("Operation impossible, il n'y pas assez d'espace sur le support de destination");
                                                DDFolder = [];
                                                return;
                                            }
                                            /**Update Json treeFolder */

                                            if (treeFolder[i].id == treeFolder[x].id) {

                                            } /**Destination = origin */
                                            else {
                                                if (procy) {
                                                    verifDbl.verif(treeFolder, mapFile, $tree, incrementor, treeFolder[i].id, treeFolder[x].id, "DD");
                                                    treeFolder[i].parent = treeFolder[x].id;
                                                    exv.storeMapFolder($container, treeFolder);
                                                    evName = "Drop répertoire réalisé";
                                                    exv.collector($container, evName, exv.getDirName(DDFolder[y], treeFolder), exv.getDirName(treeFolder[x].id, treeFolder));
                                                    procy = false;
                                                }
                                            }

                                            $tree.jstree(true).select_node(activDir);
                                            $tree.jstree(true).open_node(activDir);

                                        }
                                    } else {
                                        testDoublon = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            DDFolder = [];
            WbranchSize = 0;
        } // End Zone D&D commun function

        return {
            dragFF: function($container, config, treeFolder, mapFile, $fileList, event) {
                var rawdata = dnd_dragFF($container, config, treeFolder, mapFile, $fileList, event);
                return rawdata;
            },
            drag: function($container, config, treeFolder, mapFile, $fileList, event) {
                dnd_drag($container, config, treeFolder, mapFile, $fileList, event);
            },
            drop: function($container, config, treeFolder, mapFile, $tree, $fileList, incrementor, event) {
                dnd_drop($container, config, treeFolder, mapFile, $tree, $fileList, incrementor, event);
            }
        };

    });
//end Main function