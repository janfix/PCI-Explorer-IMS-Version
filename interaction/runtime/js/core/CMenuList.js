/*
Copyright 2023 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.


The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define([
    'exploPCI/interaction/runtime/js/labo/com_rename',
    'exploPCI/interaction/runtime/js/labo/com_new',
    'exploPCI/interaction/runtime/js/labo/com_open',
    'exploPCI/interaction/runtime/js/labo/com_copy',
    'exploPCI/interaction/runtime/js/labo/com_paste',
    'exploPCI/interaction/runtime/js/labo/verifDbl',
    'exploPCI/interaction/runtime/js/labo/com_cut',
    'exploPCI/interaction/runtime/js/labo/com_format',
    'exploPCI/interaction/runtime/js/labo/com_trash',
    'exploPCI/interaction/runtime/js/labo/com_prop',
], function(com_rename, com_new, com_open, com_copy, com_paste, verifDbl, com_cut, com_format, com_trash, com_prop) {

    function CMenu($container, config, treeFolder, mapFile, $tree, $fileList) {

        var clipBoard = [],
            WbranchSize, selectedId = null;

        /**
         * Cancel default contextMenu event !  
         */
        $container.find("div").on("contextmenu", function(event) {
            event.preventDefault(); // event must be specified in(event) for Firefox    
            checkRoot()
        });
        $container.find("nav").on("contextmenu", function(event) {
            event.preventDefault();
            return false;
        });

        function checkRoot() {
            var activBranch = $tree.jstree(true).get_selected();
            if (activBranch == 'root' || activBranch == 'netWork') { $container.find('.ctxMenu').css("display", "none"); }
        }
        /**
         * Context Menu listener
         */
        $container.find(".fileZone").on("contextmenu", function(event) {
            event.preventDefault();
        });

        /**
         * Close context menu when another element is clicked
         */
        $container.find(".accesRapide").on("click", function() {
            $container.find('.ctxMenu').css("display", "none");
        });
        $container.find(".navbar").on("click", function() {
            $container.find('.ctxMenu').css("display", "none");
        });
        $container.find(".path").on("click", function() {
            $container.find('.ctxMenu').css("display", "none");
        });
        $container.find(".fileZone").on("click", function() {
            $container.find('.ctxMenu').css("display", "none");
        });

        /**
         *  Context Menu Files and folders
         */
        var $ctxMenu = $container.find(".ctxMenu");
        $container.find(".fileZone").contextmenu(function(event) {
            $ctxMenu.css("display", "block");
            var ctxPosi = setContextMenuPostion(event, $ctxMenu)
            $ctxMenu.css("left", (ctxPosi.x) + "px");
            $ctxMenu.css("top", (ctxPosi.y) + "px");
        });
        $container.find(".explo").on("click", function() {
            $ctxMenu.css("display", "none");
        })

        function setContextMenuPostion(event, contextMenu) {

            var mousePosition = {};
            var menuPostion = {};
            var menuDimension = {};
            var pciPosition = {};

            menuDimension.x = contextMenu.outerWidth();
            menuDimension.y = contextMenu.outerHeight();

            mousePosition.x = event.pageX;
            mousePosition.y = event.pageY;

            pciPosition.x = $container.find(".explo")[0].getBoundingClientRect().left;
            pciPosition.y = $container.find(".explo")[0].getBoundingClientRect().top;



            if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
                menuPostion.x = mousePosition.x - menuDimension.x - pciPosition.x;
            } else {
                menuPostion.x = mousePosition.x - pciPosition.x;
            }
            if (mousePosition.y + menuDimension.y + 70 > $(window).height() + $(window).scrollTop()) {
                menuPostion.y = mousePosition.y - menuDimension.y - pciPosition.y - $(window).scrollTop();
            } else {
                menuPostion.y = mousePosition.y - pciPosition.y - $(window).scrollTop();
            }

            return menuPostion;
        }

        /** Order sender from contextMenu*/
        $container.find(".copyOrder").on("click", function() {
            $tree.jstree(true).ctrDrag = false;
            clipBoard = com_copy.copy($container, config, treeFolder, mapFile, $tree, $fileList, WbranchSize, selectedId);
            $ctxMenu.css("display", "none");
        });

        $container.find(".cutOrder").on("click", function() {
            //commandCut();
            $tree.jstree(true).ctrDrag = false;
            clipBoard = com_cut.cut($container, config, treeFolder, mapFile, $tree, $fileList, WbranchSize, selectedId)
            $ctxMenu.css("display", "none");
        });

        $container.find(".pasteOrder").on("click", function() {
            com_paste.paste($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList);
            clipBoard = [];
            $ctxMenu.css("display", "none");
        });

        $container.find(".newFileOrder").on("click", function() {
            com_new.file($container, config, treeFolder, mapFile, $tree, $fileList);
            $ctxMenu.css("display", "none");
        });

        $container.find(".newFolderOrder").on("click", function() {
            $tree.jstree(true).ctrDrag = false;
            com_new.folder($container, config, treeFolder, mapFile, $tree, $fileList);
            $ctxMenu.css("display", "none");
        });

        $container.find(".openOrder").on("click", function() {
            com_open.open($container, config, treeFolder, mapFile, $tree, $fileList);
            $ctxMenu.css("display", "none");
        });

        $container.find(".renameOrder").on("click", function() {
            com_rename.rename($container, config, treeFolder, mapFile, $tree, $fileList, null, null);
            $ctxMenu.css("display", "none");
        });
        $container.find(".deleteOrder").on("click", function() {
            $tree.jstree(true).ctrDrag = false;
            com_trash.trash($container, config, treeFolder, mapFile, $tree, $fileList, null);
            $ctxMenu.css("display", "none");
        });
        $container.find(".propsOrder").on("click", function() {
            com_prop.properties($container, config, treeFolder, mapFile, $tree, $fileList, null);
            $ctxMenu.css("display", "none");
        });
        $container.find(".emptyTrashOrder").on("click", function() {
            $tree.jstree(true).ctrDrag = false;
            com_trash.empty($container, config, treeFolder, mapFile, $tree, $fileList);
            $ctxMenu.css("display", "none");
        });
        $container.find(".restaureOrder").on("click", function() {
            com_trash.restore($container, config, treeFolder, mapFile, $tree, $fileList, treeFolder);
            $ctxMenu.css("display", "none");
        });
        $container.find(".homeOrder").on("click", function() {
            $tree.jstree('deselect_all');
            $tree.jstree('select_node', 'root');
            $tree.jstree('open_node', "root");
            $ctxMenu.css("display", "none");
        });






    }

    return {
        init: function($container, config, treeFolder, mapFile, $tree, $fileList) {
            CMenu($container, config, treeFolder, mapFile, $tree, $fileList);
        }
    };

});
//end Main function