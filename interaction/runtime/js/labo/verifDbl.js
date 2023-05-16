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
    'exploPCI/interaction/runtime/js/labo/free'
], function(ev, free) {


    function verif(treeFolder, mapFile, $tree, incrementor, element, placeId, operation) {

        // check doubles
        var testWritable = true;
        var FolderWritable = true // Ok to overwrite or simply write the dir

        /** element is a Folder - Case 1 */
        if (element.type == "default" || element.type == "Répertoire") {
            for (var i = 0; i < treeFolder.length; i++) {
                if (treeFolder[i].text == element.text && treeFolder[i].parent == placeId) {
                    var toriz = confirm("Attention un répertoire avec le même nom existe déjà à cet emplacement, voulez-vous l'écraser ?");
                    if (toriz == true) {
                        FolderWritable = true;
                        $tree.jstree(true).ctrDrag = false;
                        $tree.jstree(true).move_node(treeFolder[i], "erased");

                        for (var x = 0; x < treeFolder.length; x++) {
                            if (treeFolder[x].id == element.id) {
                                treeFolder[x].parent = placeId;
                                treeFolder[x].data.type = element.data.type;
                                treeFolder[x].data.type = element.data.dateMod;
                                treeFolder[x].data.type = element.data.dateCreat;
                                treeFolder[i].parent = erased;
                                $tree.jstree(true).move_node(treeFolder[x], placeId);
                            }
                        }

                        return FolderWritable;

                    } else {
                        //Case : cancel
                        FolderWritable = false;
                        alert("cet élément reste temporairement disponible en mémoire. Vous pouvez le coller à un autre endroit pour le rendre à nouveau disponible.");
                    }
                }
            }
            return FolderWritable;
        } else { // For files
            if (operation == "copy") {
                if (placeId == element.origin) {
                    //Automatic Incrimentation double in same folder
                    var testFP = testFreeSpace(placeId, element, "copy"); // Test if there is enough space on the volume
                    if (testFP) {
                        //allowed
                        element.fileId = mapFile.length + 1;
                        element.name = "copie_" + incrementor + "_de_" + element.name;
                        element.dateMod = ev.getNowDate();
                        mapFile.push(element);
                        incrementor = incrementor + 1;
                    } else {
                        //Not allowed
                        alert("Espace insuffisant pour achever l'opération. Libérer de l'espace et recommencer");
                    }

                } else {
                    //scan if file name plus extension and destination already exist !
                    for (var i = 0; i < mapFile.length; i++) {
                        if (mapFile[i].name == element.name && mapFile[i].extension == element.extension && mapFile[i].node == placeId) {
                            //Doubles are identify
                            var autoriz = confirm("Attention un fichier avec le même nom et la même extension existe déjà à cet emplacement, voulez-vous l'écraser ?");
                            if (autoriz == true) {
                                var testFP = testFreeSpace(placeId, element, "copy"); // Test if there is enough space on the volume
                                if (testFP) {
                                    mapFile[i].size = element.size;
                                    mapFile[i].dateMod = ev.getNowDate();
                                    mapFile[i].dateCreat = element.dateCreat;
                                    mapFile[i].content = element.content;
                                    mapFile[i].dateLastAcces = element.dateLastAcces;
                                    mapFile[i].author = element.author;
                                    mapFile[i].app = element.app;
                                    mapFile[i].image_url = element.image_url;
                                    testWritable = false;
                                } else {
                                    alert("Espace insuffisant pour achever l'opération. Libérer de l'espace et recommencer");
                                    testWritable = false;
                                }

                            } else {
                                testWritable = false;
                            }
                        }
                    }
                    if (testWritable) {
                        //Simple paste case

                        var testFP = testFreeSpace(placeId, element); // Test if there is enough space on the volume
                        if (testFP) {
                            element.node = placeId;
                            element.fileId = mapFile.length + 1;
                            element.dateMod = ev.getNowDate();
                            mapFile.push(element);
                        } else {
                            alert("Espace insuffisant pour achever l'opération. Libérer de l'espace et recommencer");
                            testWritable = false;
                        }
                    }
                }
            } else if (operation == "cut") {
                for (var i = 0; i < mapFile.length; i++) {
                    if (mapFile[i].name == element.name && mapFile[i].node == placeId && mapFile[i].extension == element.extension) {
                        console.log(operation);
                        var autoriz = confirm("Attention un fichier avec le même nom et la même extension existe déjà à cet emplacement, voulez-vous l'écraser ?");
                        if (autoriz == true) {
                            var testFP = testFreeSpace(placeId, element, "move"); // Test if there is enough space on the volume
                            if (testFP) {
                                //allowed
                                mapFile[i].node = "erased"; // Erased the previous element  
                                for (var y = 0; y < mapFile.length; y++) { // search the element to paste
                                    if (mapFile[y].name == element.name && mapFile[y].node == 'clipBoard' && mapFile[y].extension == element.extension) {
                                        mapFile[y].node = placeId;
                                        return mapFile[y];
                                    }
                                }
                            } else {
                                //Not allowed
                                alert("Espace insuffisant pour achever l'opération. Libérer de l'espace et recommencer");
                                for (var y = 0; y < mapFile.length; y++) { // search the element to paste
                                    if (mapFile[y].name == element.name && mapFile[y].node == 'clipBoard' && mapFile[y].extension == element.extension) {
                                        mapFile[y].node = mapFile[y].origin; // Back to previous state      
                                    }
                                }
                                testWritable = false;
                            }
                        } else {
                            for (var y = 0; y < mapFile.length; y++) { // search the element to paste
                                if (mapFile[y].name == element.name && mapFile[y].node == 'clipBoard' && mapFile[y].extension == element.extension) {
                                    mapFile[y].node = mapFile[y].origin; // Back to previous state      
                                }
                            }
                        }
                        testWritable = false;
                    }
                }
                if (testWritable == true) {
                    for (var i = 0; i < mapFile.length; i++) {
                        if (mapFile[i].name == element.name && mapFile[i].extension == element.extension && mapFile[i].node == "clipBoard") {
                            var testFP = testFreeSpace(placeId, element, "move"); // Test if there is enough space on the volume
                            if (testFP) {
                                //allowed
                                mapFile[i].node = placeId;
                            } else {
                                //Not allowed
                                alert("Espace insuffisant pour achever l'opération. Libérer de l'espace et recommencer");
                                testWritable = false;
                                for (var y = 0; y < mapFile.length; y++) { // search the element to paste
                                    if (mapFile[y].name == element.name && mapFile[y].node == 'clipBoard' && mapFile[y].extension == element.extension) {
                                        mapFile[y].node = mapFile[y].origin; // Back to previous state      
                                    }
                                }
                            }
                        }
                    }
                }

            } else {
                for (var i = 0; i < mapFile.length; i++) {
                    if (mapFile[i].name == element.name && mapFile[i].node == placeId && mapFile[i].extension == element.extension) {
                        var autoriz = confirm("Attention un fichier avec le même nom et la même extension existe déjà à cet emplacement, voulez-vous l'écraser ?");
                        if (autoriz == true) {
                            mapFile[i].node = "erased"; // Erased the previous element
                            for (var y = 0; y < mapFile.length; y++) { // search the element to paste
                                if (mapFile[y].fileId == element.fileId) {
                                    var testFP = testFreeSpace(placeId, element, "move"); // Test if there is enough space on the volume
                                    if (testFP) {
                                        //allowed
                                        mapFile[y].node = placeId;
                                        return mapFile[y];
                                    } else {
                                        //Not allowed
                                        alert("Espace insuffisant pour achever l'opération. Libérer de l'espace et recommencer");
                                        for (var y = 0; y < mapFile.length; y++) { // search the element to paste
                                            if (mapFile[y].fileId == element.fileId) {
                                                mapFile[y].node = mapFile[y].origin; // Back to previous state for dragged element     
                                            }
                                            if (mapFile[y].name == element.name && mapFile[y].extension == element.extension && mapFile[y].node == "erased") {
                                                mapFile[y].node = placeId; // Back to previous state  for targeted element  
                                            }
                                        }
                                        testWritable = false;
                                    }
                                }
                            }
                        } else {
                            for (var y = 0; y < mapFile.length; y++) { // search the element to paste
                                if (mapFile[y].fileId == element.fileId) {
                                    mapFile[y].node = mapFile[y].origin; // Back to previous state  for dragged element    
                                }
                                if (mapFile[y].name == element.name && mapFile[y].extension == element.extension && mapFile[y].node == "erased") {
                                    mapFile[y].node = placeId; // Back to previous state  for targeted element  
                                }
                            }
                        }
                        testWritable = false;
                    }
                }
                if (testWritable == true) {
                    for (var i = 0; i < mapFile.length; i++) {
                        if (mapFile[i].fileId == element.fileId) {
                            var testFP = testFreeSpace(placeId, element, "move"); // Test if there is enough space on the volume
                            if (testFP) {
                                //allowed
                                mapFile[i].node = placeId;
                            } else {
                                //Not allowed
                                alert("Espace insuffisant pour achever l'opération. Libérer de l'espace et recommencer");
                                for (var y = 0; y < mapFile.length; y++) { // search the element to paste
                                    if (mapFile[y].fileId == element.fileId) {
                                        mapFile[y].node = mapFile[y].origin; // Back to previous state      
                                    }
                                }
                                testWritable = false;
                            }
                        }
                    }

                }
            }
        }

        /**
         * Return free space
         * @param {string} desti 
         * @param {obj} element 
         * @param {string} operation 
         * @returns {number}  Free space value for a volume.
         */
        function testFreeSpace(desti, element, operation) { // desti is an id node, element is an object
            var destiNodeId, originalVol, freespace, rest, tfSpace, size = element.size;
            // get destination volume
            destiNodeId = ev.getVol(treeFolder, $tree, desti);
            originalVol = ev.getVol(treeFolder, $tree, element.origin);
            if (destiNodeId == originalVol && operation == "move") {
                tfSpace = true;
                return tfSpace;
            } else if (desti == "bin") {
                tfSpace = true;
                return tfSpace;
            } else {
                freespace = free.freeSpace(treeFolder, mapFile, $tree, $tree.jstree(true).get_node(destiNodeId));
                rest = freespace - parseInt(size);
                if (rest > 0) {
                    tfSpace = true
                } else {
                    tfSpace = false
                }
                return tfSpace;
            }
        }


    }

    return {
        verif: function(treeFolder, mapFile, $tree, incrementor, element, placeId, operation) {
            var testWrite = verif(treeFolder, mapFile, $tree, incrementor, element, placeId, operation);
            return testWrite;
        }
    };

});
//end Main function