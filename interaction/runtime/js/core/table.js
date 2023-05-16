/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.


The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/lib/datatables',
    'exploPCI/interaction/runtime/js/labo/eventTracker',
    'exploPCI/interaction/runtime/js/labo/com_open',
    'exploPCI/interaction/runtime/js/core/displayDirContent'

], function($, evt, com_open, displayDirContent) {

    function tableInit($container, config, $tree, treeFolder) {
        var mapFile = config.data.mapFile;
        $container.find('.dirContent').empty()
            //old tableDisplayer
        var uniqID = $container.find('.dirContent').attr("data-id");
        var $fileList = $container.find("." + uniqID).DataTable({
            "language": {
                "emptyTable": "Aucun élément dans ce répertoire."
            },
            "destroy": true,
            "select": true,
            "paging": false,
            "ordering": true,
            "info": false,
            "searching": false,
            "columnDefs": [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            "columns": [{
                    title: "fileId",
                    "visible": false
                },
                {
                    title: "Nom",
                    width: "180px"
                },
                {
                    title: "Date de Modification",
                    width: "100px"
                },
                {
                    title: "Type",
                    width: "160px"
                },
                {
                    title: "Taille",
                    width: "80px",
                    className: 'dt-body-right'
                },
                {
                    title: "Date de Création",
                    width: "100px",
                    className: 'dt-body-right'
                },
                {
                    title: "Chemin",
                    width: "350px",
                    visible: true

                },
            ]
        });

        //*******************Listening to DataTables elements*******************/
        /**Listening to DataTables elements - show selected row*/
        $container.find(".dirContent tbody").on('mouseenter', 'tr', function() {
            $container.find(this).addClass('highlight');
        });
        $container.find(".dirContent tbody").on('mouseleave', 'tr', function() {
            $container.find(this).removeClass('highlight');
        });

        /**Listening list directories for browsing */
        $container.find('.dirContent tbody').on('dblclick', 'tr', function(e) {
            var evName, saveSelectDir, targetName, targetPlace;
            $container.find('.ctxMenu').css("display", "none");


            if ($fileList.row(this).data()[3] == "Répertoire" ||
                $fileList.row(this).data()[3] == "Volume" ||
                $fileList.row(this).data()[3] == "Mémoire Flash" ||
                $fileList.row(this).data()[3] == "Mémoire Flash usb" ||
                $fileList.row(this).data()[3] == "Lecteur Optique CD"
            ) {
                saveSelectDir = $fileList.row(this).data()[0];
                $tree.jstree('deselect_all');
                $tree.jstree('select_node', saveSelectDir);

                evName = "Double Clic dans liste- ouverture de ";
                evt.collector($container, evName, evt.getDirName(saveSelectDir, treeFolder), "-");

                displayDirContent.now($container, config, saveSelectDir, $fileList, $tree, mapFile);

            } else {
                //console.log("OPEN FILE ON DBCLICK")
                $fileList.rows().deselect();
                targetName = $(e.currentTarget).find(".elementNameExt")[0].innerText;
                targetPlace = $tree.jstree(true).get_selected();
                $fileList.row(this).select()


                com_open.open($container, config, treeFolder, mapFile, $tree, $fileList)

                evName = "Double Clic - ouverture de fichier";
                evt.collector($container, evName, targetName, evt.getDirName(targetPlace, treeFolder));
            }
        });

        return [$fileList, mapFile];
    }

    return {
        init: function($container, config, $tree, treeFolder) {
            var TableData = tableInit($container, config, $tree, treeFolder);
            return TableData;
        }
    };

});
//end Main function