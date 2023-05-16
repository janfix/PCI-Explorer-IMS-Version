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
    'exploPCI/interaction/runtime/js/core/displayDirContent'
], function (ev, displayDirContent) {

    /**
     * Rename a file or a folder. 
     * Check if one file or folder is highlighted (zero or more than one is not accepted) 
     * Check if the name is available
     * The name format is not checked(everything accepted)
     * @param {*} selectedNodeId 
     * @param {*} selectedNodeName 
     */
    function rename($container, config, treeFolder, mapFile, $tree, $fileList, selectedNodeId, selectedNodeName) {
        var element, evName;
        var activDir = $tree.jstree(true).get_selected();
        var renamable = true;

        //Neutralisation du rename sur le CD Rom
        var actifNode = $tree.jstree(true).get_selected(true);
        if (actifNode[0].id == "cdRom") {
            alert("Il est impossible d'écrire sur ce support")
            $(".modali").hide();
            return
        } 
        
        if (!selectedNodeId) {
            // Warning mono selection only
            SelectedArr = $fileList.rows({
                selected: true
            })[0];
            if (SelectedArr.length > 1) {
                alert("Attention plusieurs éléments ont été sélectionnés, il ne faut en sélectionner qu'un.");
            } else if (!SelectedArr.length) {
                alert("Attention aucun élément n'est sélectionné");
            } else {
                for (var index = 0; index < SelectedArr.length; index++) {
                    var indexElement = SelectedArr[index];
                    element = $fileList.row(indexElement).data();
                    if (element[3] == "Répertoire") {
                        $container.find(".contentModal").html("<h3>Renommer le répertoire</h3><input class='renamerInput' type='text' value=" + getFolderName(treeFolder, element[0]) + " ><button class='btDirRenamer'>OK</button><button class='annulModal'>Annuler</button>");
                        $container.find(".btDirRenamer").click(function () {
                            for (var i = 0; i < treeFolder.length; i++) {
                                if (treeFolder[i].id == element[0]) {
                                    // Verify
                                   // console.log(element[0]);
                                   
                                    var newName = $container.find(".renamerInput").val();
                                    for (var y = 0; y < treeFolder.length; y++) {
                                        if (treeFolder[y].text == newName && treeFolder[y].parent == treeFolder[i].parent) {
                                            alert("Un répertoire porte déjà ce nom à cet endroit ! Impossible de le renommer ainsi. Choisissez un autre nom.");
                                            renamable = false;
                                            return renamable
                                        } else {
                                            renamable = true;
                                        }
                                    }
                                    if (renamable) {
                                        var folderPathName = treeFolder[i].text.split("/");
                                        //console.log(folderPathName);
                                        var rightIndex = (folderPathName.length)-2;
                                        //console.log(rightIndex);
                                        //console.log(folderPathName[rightIndex]);
                                        if (rightIndex>-1){
                                            alert("Il n'est pas possible de renomer le répertoire depuis les résultats de la recherche. Utilisez le menu contextuel de l'arborescence.");
                                            /* console.log(treeFolder[i].id);
                                            $tree.jstree('rename_node', $tree.jstree(true).get_node(treeFolder[i].id), $container.find(".renamerInput").val());
                                            treeFolder[i].originalName = treeFolder[i].text;
                                            treeFolder[i].text = newName;
                                            treeFolder[i].data.dateMod = ev.getNowDate();
                                            $tree.jstree(true).refresh();
                                            evName = "Mcontextuel - Renommage du répertoire";
                                            ev.collector($container, evName, treeFolder[i].originalName, treeFolder[i].text);
                                            ev.storeMapFolder($container, treeFolder); */
                                        }
                                        else{
                                        $tree.jstree('rename_node', $tree.jstree(true).get_node(treeFolder[i].id), $container.find(".renamerInput").val());
                                        treeFolder[i].originalName = treeFolder[i].text;
                                        treeFolder[i].text = newName;
                                        treeFolder[i].data.dateMod = ev.getNowDate();
                                        $tree.jstree(true).refresh();
                                        evName = "Mcontextuel - Renommage du répertoire";
                                        ev.collector($container, evName, treeFolder[i].originalName, treeFolder[i].text);
                                        ev.storeMapFolder($container, treeFolder);
                                        ev.storeMapFile($container, mapFile);
                                        displayDirContent.now($container, config, activDir, $fileList, $tree, mapFile);
                                        }                                        
                                    }
                                }
                            }
                            $container.find(".modali").hide();
                            
                        });

                    } else {
                        /**
                         * element[0] is id of file in mapFile
                         */
                        if (activDir[0] == "searchResult"){
                        for (let i = 0; i < mapFile.length; i++) {
                            if(mapFile[i].fileId == element[0]){
                                //powerRenamer(element[0]);
                                powerRenamer(mapFile[i].originalID);
                                 //$tree.jstree.select_node(mapFile[i].originalPath);
                                $tree.jstree('activate_node', mapFile[i].originalPath);
                            };
                            
                        }}
                        else{powerRenamer(element[0]);}
                        

                        function powerRenamer(elZero) {
                            //elZero is the id of the element to rename ! 
                            for (var ix = 0; ix < mapFile.length; ix++) {
                                var fileElement = mapFile[ix];
                                if (fileElement.fileId == elZero) {
                                    $container.find(".contentModal").html("<h3>Renommer le fichier</h3><input class='renamerInput' type='text' value=" + getFileName(mapFile, elZero) + "> . <input class='RenameExtension' type='text' value=" + getExtension(mapFile, elZero).substring(1) + "><button class='btFileRenamer'>OK</button><button class='annulModal'>Annuler</button>");
                                    var protectedFile = fileElement; // necessary -fileElement is lost in following function !    
                                    $container.find(".btFileRenamer").click(function () {                                            
                                        // Check the name + ext in same dir                                  
                                        var newName = {};
                                        newName.name = $container.find(".renamerInput").val() 
                                        newName.ext = $container.find(".RenameExtension").val()
                                        var checkName = nameUsed(newName, mapFile, activDir); 
                                        //console.log(checkName)
                                        var oldName = protectedFile.name + protectedFile.extension;
                                        if (checkName){ 
                                            alert("Un fichier porte déjà ce nom et cette extension à cet endroit ! Impossible de le renommer ainsi. Choisissez un autre nom");
                                            } else {
                                            var newNameAsw = newName.name  + "." + newName.ext;
                                            protectedFile.name = newName.name;
                                            protectedFile.extension = "." + newName.ext;
                                            protectedFile.dateMod = ev.getNowDate();
                                            $container.find(".modali").hide();
                                            $tree.jstree('open_node', activDir);
                                            
                                            if (typeof fileElement.originalPath !== "undefined") {
                                               $tree.jstree('activate_node', fileElement.originalPath);
                                            }
                                            
                                            displayDirContent.now($container, config, activDir, $fileList, $tree, mapFile);
                                            
                                            evName = "Mcontextuel - Renommer le fichier";
                                            ev.collector($container, evName, oldName, newNameAsw);
                                            ev.storeMapFile($container, mapFile);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
                $container.find(".modali").show().css({
                    width: "600px",
                    height: "140px"
                });
                $container.find(".renamerInput").css("width", "170px").focus();
                $container.find('.modalTitle').remove();


                $container.find(".annulModal").click(function () {
                    $container.find(".modali").hide();
                });

            }

        } else {
            $container.find(".modali").show().css({
                width: "500px",
                height: "140px"
            });
            $container.find(".renamerInput").css("width", "170px").focus();
            $container.find(".contentModal").html("<h3>Renommer le répertoire</h3><input class='renamerInput' type='text' value=" + selectedNodeName + " ><button class='btDirRenamer'>OK</button><button class='annulModal'>Annuler</button>");
            $container.find(".annulModal").click(function () {
                $container.find(".modali").hide();
            });
            $container.find(".btDirRenamer").click(function () {
                for (var i = 0; i < treeFolder.length; i++) {
                    if (treeFolder[i].id == selectedNodeId) {
                        // Verify
                        var newName = $container.find(".renamerInput").val();

                        for (var y = 0; y < treeFolder.length; y++) {
                            if (treeFolder[y].text == newName && treeFolder[y].parent == treeFolder[i].parent) {
                                alert("Un répertoire porte déjà ce nom à cet endroit ! Impossible de le renommer ainsi. Choisissez un autre nom.");
                                renamable = false;
                                return renamable
                            } else {
                                renamable = true;
                            }

                        }
                        if (renamable) {
                            $tree.jstree('rename_node', $tree.jstree(true).get_node(treeFolder[i].id), $container.find(".renamerInput").val());
                            treeFolder[i].originalName = treeFolder[i].text
                            treeFolder[i].text = newName;
                            treeFolder[i].data.dateMod = ev.getNowDate();
                            $tree.jstree(true).refresh();
                            evName = "Mcontextuel - Renommage du répertoire";
                            ev.collector($container, evName, treeFolder[i].originalName, treeFolder[i].text);
                            ev.storeMapFolder($container, treeFolder);
                            ev.storeMapFile($container, mapFile);
                        }
                    }
                }
                $container.find(".modali").hide();
                $tree.jstree('open_node', activDir);
               
            });
        }


    }

    /** get a file name by id
     * @param {string} id - node id
     */
    function getFileName(mapFile, id) {
        var targetFileName = "";
        for (var index = 0; index < mapFile.length; index++) {
            if (mapFile[index].fileId == id)
                targetFileName = mapFile[index].name;
        }
        return targetFileName;
    }

    /** get extension string by id 
     * @param {string} id - node id
     */
    function getExtension(mapFile, id) {
        var target = "";
        for (var index = 0; index < mapFile.length; index++) {
            if (mapFile[index].fileId == id)
                target = mapFile[index].extension;
        }
        return target;
    }

    function nameUsed(newName, mapFile, activDir){
        //console.log(activDir);
        var check = false;
        for (var index = 0; index < mapFile.length; index++) {
           // console.log(mapFile[index].node)
            if (mapFile[index].name == newName.name && mapFile[index].extension == "." + newName.ext && mapFile[index].node == activDir[0])
               { console.log("Houston we have a problem")
                check = true;
            } else { 
                console.log("Tout OK on peut renommer")
                }   
        }
        return check;
    }

    /** get a folder name by id
     * @param {string} id - node id
     */
    function getFolderName(treeFolder, id) {
        var targetFolderName = "", rightIndex;
        //console.log(treeFolder);
        //console.log(id) ;
        for (var index = 0; index < treeFolder.length; index++) {
            if (treeFolder[index].id == id){
                targetFolderName = treeFolder[index].text.split("/"); 
                //console.log(targetFolderName);
                 if (targetFolderName.length == 1) {
                     //console.log("COURT");

                     return targetFolderName[0];
                 }else{
                     //console.log("LONG");
                    rightIndex = targetFolderName.length - 2;
                    return targetFolderName[rightIndex];
                 }
            }
                 //console.log(rightIndex);
                 //console.log(targetFolderName[rightIndex]);
                 
        }
       
           //return targetFolderName[rightIndex];
       
    }


    return {
        
        rename: function ($container, config, treeFolder, mapFile, $tree, $fileList, selectedNodeId, selectedNodeName) {
            rename($container, config, treeFolder, mapFile, $tree, $fileList, selectedNodeId, selectedNodeName);
        }


    };

});
//end Main function