/*
Copyright 2023 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define([
        'exploPCI/interaction/runtime/js/lib/datatables',
        'exploPCI/interaction/runtime/js/labo/eventTracker',
        'exploPCI/interaction/runtime/js/labo/com_rename',
        'exploPCI/interaction/runtime/js/labo/com_new',
        'exploPCI/interaction/runtime/js/labo/com_open',
        'exploPCI/interaction/runtime/js/labo/com_copy',
        'exploPCI/interaction/runtime/js/labo/com_paste',
        'exploPCI/interaction/runtime/js/labo/com_cut',
        'exploPCI/interaction/runtime/js/labo/com_format',
        'exploPCI/interaction/runtime/js/labo/com_trash',
        'exploPCI/interaction/runtime/js/labo/com_prop',


    ],
    function($, evt, com_rename, com_new, com_open, com_copy, com_paste, com_cut, com_format, com_trash, com_prop) {

        function runtree($container, config) {
            // Attention le config.data brut est devenu du text au format JSON string
            // Il faut le retransformer en OBJ 
            config.data = JSON.parse(config.data)
                //tfolder n'est plus nécessaire il est dans config.data.treeFolder
            var tfolder = config.data.treeFolder;
            //Alias 
            var treeFolder = tfolder,
                clipBoard = [];
            var uniqID = new Date().valueOf().toString();
            $container.find('.jstree').addClass(uniqID).attr("data-id", uniqID);
            //console.log($container.find('.jstree'))

            var noMove = ["cdRom", "root", "netWork", "#"],
                writable = true,
                i, evName, $tree = $container.find("." + uniqID);

            $tree.jstree({
                core: {
                    "dblclick_toggle": false,
                    'data': function getData() {
                        return tfolder
                    },
                    "check_callback": function(operation, node, node_parent, node_position, more) { //It is forbidden to copy folders at thess levels
                        console.log(this.ctrDrag)
                        if (operation === 'move_node' || operation === 'copy_node') {
                            if (this.ctrDrag || typeof this.ctrDrag == "undefined") {
                                for (i = 0; i < noMove.length; i++) {
                                    if (noMove.indexOf(node_parent.type) < 0 || noMove.indexOf(node_parent.id) < 0) {
                                        console.log("INSIDE THE CALLBACK")
                                        $tree.jstree(true).deselect_all();
                                        writable = true;
                                        var dataF = this.element[0].dataFiles;
                                        var EL2Mov = node.original.id;
                                        //var desti = node_parent.id;
                                        var destiVolumeID = evt.getVol(treeFolder, $tree, node_parent)
                                            //console.log($tree.jstree(true).get_node(destiVolumeID))
                                        try {
                                            var targetFreeSpace = $tree.jstree(true).get_node(destiVolumeID).data.freeSpace;
                                        } catch (error) {
                                            console.log("Error controled")
                                        }
                                        //console.log(ElementSize)
                                        var date = new Date(Date.now());
                                        var formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' });
                                        node_parent.data.dateMod = formattedDate;
                                        var ElementSize = evt.branchSize($tree, dataF, EL2Mov);
                                        var freeSpace = targetFreeSpace - ElementSize;
                                        if (isNaN(freeSpace)) { freeSpace = 1 }

                                        if (freeSpace > 0) {
                                            $tree.jstree(true).ctrDrag = false;
                                            return true;
                                        } else {
                                            $tree.jstree(true).ctrDrag = false;
                                            return false;
                                        }
                                    } else {
                                        $tree.jstree(true).ctrDrag = false;
                                        return false;
                                    }
                                }

                            } else {
                                // this.ctrDrag = true;
                                $tree.jstree(true).ctrDrag = true;
                                return true;
                            }

                            //This test define if the operation is possible or not
                            //But it has also the control if the operation is comming from the datatables.


                        }
                        /* if (operation == 'copy_node') {
                            //TODO implement CTRL DRAG to copy additional node-data for copy operation;
                        } */
                    }
                },
                plugins: ["contextmenu", "types", "dnd", "unique", "wholerow"],
                'contextmenu': {
                    'items': customMenu
                },
                dnd: {
                    "is_draggable": function(node, event) {
                            if (node[0].type == "default") { // Todo to sensitive, trigger to much.
                                evName = "Drag du répertoire depuis arborescence ";
                                evt.collector($container, evName, "-", "-");
                                return true; // Controle draggable here --- flip switch here.
                            } else {
                                return false;
                            }
                        }
                        //check_while_dragging: true 
                },
                types: {
                    "bin": {
                        "icon": "jstree-bin" //use sprite via CSS class
                    },
                    "volume": {
                        "icon": "jstree-hdrive"
                    },
                    "cdRom": {
                        "icon": "jstree-CDrom"
                    },
                    "netWork": {
                        "icon": "jstree-network"
                    },
                    "cloud": {
                        "icon": "jstree-cloud"
                    },
                    "sdCard": {
                        "icon": "jstree-sdCard"
                    },
                    "usb": {
                        "icon": "jstree-usb"
                    },
                    "distant": {
                        "icon": "jstree-distant"
                    },
                    'root': {
                        "icon": "jstree-root"
                    }
                }
            }).bind("move_node.jstree", function(e, data) {
                destiTarget = data.parent;
                evName = "Déplacement de répertoire ";
                evt.collector($container, evName, evt.getDirName(data.node.id, tfolder), evt.getDirName(data.parent, tfolder));

            });

            $tree.on("ready.jstree", function(e, data) {
                $tree.jstree("select_node", "root");
            });


            /**Open folder with one Click instead of doubleClick */
            $tree.bind("select_node.jstree", function(e, data) {
                return data.instance.toggle_node(data.node);
            });

            $tree.jstree(true).settings.core.data = tfolder;

            $tree.jstree(true).refresh();

            /**Listen to drop in jstree specific mvt. 
             * @param {obj} activDir : is the activ node build by Jstree - This name will be used frequently in code !
             */
            $container.find(".explo").on("dnd_stop.vakata", function(e, data) {
                var activDir, i, y;
                for (i = 0; i < tfolder.length; i++) {
                    for (y = 0; y < data.data.nodes.length; y++) {
                        if (tfolder[i].id == data.data.nodes[y]) {
                            tfolder[i].parent = destiTarget;
                            activDir = $tree.jstree(true).get_selected();
                            $tree.jstree(true).select_node(activDir);
                            $tree.jstree(true).open_node(activDir);

                            //displayDirContent.now($container, config, activDir, $fileList, $tree);

                            evt.storeMapFolder($container, tfolder);
                        }
                    }
                }
            });

            function customMenu() {
                var dTable = $container.find('.dirContent').dataTable(),
                    $fileList = evt.$fileList,
                    WbranchSize;

                var mapFile = JSON.parse($container.find(".dataFiles").html())


                var items;
                if ($tree.jstree("get_selected", true)[0].type == "volume") {
                    console.log("volume selector is working")
                    items = {
                        createDir: {
                            label: "Nouveau répertoire",
                            action: function(obj) {
                                com_new.folder($container, config, tfolder, mapFile, $tree, $fileList);
                            },
                            icon: "fa fa-folder"
                        },
                        collerDir: {
                            label: "Coller",
                            action: function(obj) {
                                com_paste.paste($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList);
                            },
                            icon: "fa fa-plus-square"
                        },
                        formatVol: {
                            label: "Formater...",
                            action: function(obj) {
                                var selectedNodeId = $tree.jstree("get_selected", true);
                                com_format.format($container, config, treeFolder, mapFile, $tree, selectedNodeId[0].text, selectedNodeId[0].id);

                            }
                        },
                        propertiesDir: {
                            label: "Propriétés",
                            action: function(obj) {
                                var selectedNode = $tree.jstree("get_selected", true);
                                com_prop.properties($container, config, treeFolder, mapFile, $tree, $fileList, selectedNode);
                            },
                            icon: "fa fa-cog"
                        }
                    }
                    return items;

                } else if ($tree.jstree("get_selected", true)[0].type == "root") {
                    items = {
                        propertiesDir: {
                            label: "Propriétés",
                            action: function(obj) {
                                var selectedNode = $tree.jstree("get_selected", true);
                                com_prop.properties($container, config, treeFolder, mapFile, $tree, $fileList, selectedNode);
                            },
                            icon: "fa fa-cog"
                        }
                    }
                    return items;
                } else if ($tree.jstree("get_selected", true)[0].type == "usb" || $tree.jstree("get_selected", true)[0].type == "sdCard") {
                    items = {
                        createDir: {
                            label: "Nouveau répertoire",
                            action: function(obj) {
                                com_new.folder($container, config, tfolder, mapFile, $tree, $fileList);
                            },
                            icon: "fa fa-folder"
                        },
                        collerDir: {
                            label: "Coller",
                            action: function(obj) {
                                com_paste.paste($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList);
                            },
                            icon: "fa fa-plus-square"
                        },
                        formatVol: {
                            label: "Formater...",
                            action: function(obj) {
                                var selectedNodeId = $tree.jstree("get_selected", true);
                                com_format.format($container, config, treeFolder, mapFile, $tree, selectedNodeId[0].text, selectedNodeId[0].id);
                            }
                        },
                        propertiesDir: {
                            label: "Propriétés",
                            action: function(obj) {
                                var selectedNode = $tree.jstree("get_selected", true);
                                com_prop.properties($container, config, treeFolder, mapFile, $tree, $fileList, selectedNode);
                            },
                            icon: "fa fa-cog"
                        }
                    }
                    return items;

                } else if ($tree.jstree("get_selected", true)[0].type == "cdRom") {
                    items = {
                        propertiesDir: {
                            label: "Propriétés",
                            action: function(obj) {
                                var selectedNode = $tree.jstree("get_selected", true);
                                com_prop.properties($container, config, treeFolder, mapFile, $tree, $fileList, selectedNode);
                            },
                            icon: "fa fa-cog"
                        }
                    }
                    return items;
                } else if ($tree.jstree("get_selected", true)[0].type == "bin") {
                    items = {
                        emptyBin: {
                            label: "Vider la corbeille",
                            action: function(obj) {
                                com_trash.empty($container, config, tfolder, mapFile, $tree, $fileList);
                            },
                            icon: "fa fa-recycle"
                        }
                    }
                    return items;
                } else if ($tree.jstree("get_selected", true)[0].type == "netWork") {

                } else {
                    items = {
                        createDir: {
                            label: "Nouveau répertoire",
                            action: function(obj) {
                                com_new.folder($container, config, tfolder, mapFile, $tree, $fileList);
                            },
                            icon: "fa fa-folder"
                        },
                        renameDir: {
                            label: "Renommer",
                            action: function(obj) {
                                var SelectedArr = $tree.jstree("get_selected", true);
                                if (SelectedArr.length > 1) {
                                    alert("Attention plusieurs éléments ont été sélectionnés");
                                } else if (!SelectedArr.length) {
                                    alert("Attention aucun élément n'est sélectionné");
                                } else {
                                    var selectedNodeId = $tree.jstree("get_selected", true)[0].id;
                                    var selectedNodeName = $tree.jstree("get_selected", true)[0].text;
                                    com_rename.rename($container, config, tfolder, "", $tree, $fileList, selectedNodeId, selectedNodeName);
                                }
                            },
                            icon: "fa fa-cog"
                        },
                        copierDir: {
                            label: "Copier",
                            action: function(obj) {
                                $tree.jstree(true).ctrDrag = false;
                                var selectedNodeId = $tree.jstree("get_selected", true)[0].id;
                                com_copy.copy($container, config, tfolder, mapFile, $tree, $fileList, WbranchSize, selectedNodeId);
                            },
                            icon: "fa fa-clipboard"
                        },
                        couperDir: {
                            label: "Couper",
                            action: function(obj) {
                                $tree.jstree(true).ctrDrag = false;
                                var selectedNodeId = $tree.jstree("get_selected", true)[0].id;
                                com_cut.cut($container, config, tfolder, mapFile, $tree, $fileList, WbranchSize, selectedNodeId);
                            },
                            icon: "fa fa-scissors"
                        },
                        collerDir: {
                            label: "Coller",
                            action: function(obj) {
                                //console.log(WbranchSize);
                                com_paste.paste($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList);
                            },
                            icon: "fa fa-plus-square"
                        },
                        deleteDir: {
                            label: "Effacer",
                            action: function(obj) {
                                $tree.jstree(true).ctrDrag = false;
                                var selectedNodeId = $tree.jstree("get_selected");
                                com_trash.trash($container, config, tfolder, mapFile, $tree, $fileList, selectedNodeId);
                            },
                            icon: "fa fa-trash"
                        },
                        propsDir: {
                            label: "Propriétés",
                            action: function(obj) {
                                var selectedNode = $tree.jstree("get_selected", true);
                                com_prop.properties($container, config, tfolder, mapFile, $tree, $fileList, selectedNode);
                            },
                            icon: "fa fa-cog"
                        }
                    }
                    return items;

                }
            }

            $tree.tfolder = tfolder;
            return { $tree };
        }

        return {
            run: function($container, config) {
                var $tree = runtree($container, config);
                return $tree;
            }
        };

    });
//end Main function