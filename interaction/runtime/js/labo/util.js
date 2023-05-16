/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/labo/eventTracker'], function(ev) {

    /**
     * Define unit for file size and display a readable size format
     * @param {val} size 
     * @returns {val} readable size format
     * Kbyte is the unity in Json file.
     */
    function bytUnit(size) {
        var rightSize;
        var megabyteTest = parseInt(size) / 1000;
        var gigabyteTest = parseInt(size) / 1000000;
        var terabyteTest = parseInt(size) / 1000000000;

        if (megabyteTest < 1) {
            rightSize = Number.parseFloat(size).toFixed(2) + " Ko";
        } else {
            if (gigabyteTest < 1) {
                rightSize = Number.parseFloat(megabyteTest).toFixed(2) + " Mo";
            } else {
                if (terabyteTest < 1) {
                    rightSize = Number.parseFloat(gigabyteTest).toFixed(2) + " Go";
                } else {
                    rightSize = Number.parseFloat(terabyteTest).toFixed(2) + " To";
                }
            }
        }
        if (rightSize == 'NaN') {
            return "-";
        } else {
            return rightSize;
        }

    }

    /**
     * change date format.
     * @param {date} isodate  Date in Iso format
     * @returns {date} the date in dd/mm/yyyy format
     */
    function setEurodate(isodate) {
        var eurodate;
        if (!isNaN(isodate[0])) {
            var dateObj = new Date(isodate);
            eurodate = ('0' + dateObj.getDate()).slice(-2) + '/' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '/' + dateObj.getFullYear();
        } else {
            eurodate = "-";
        }
        return eurodate;
    }

    /**Details of file type hard-coded -> Todo dynamic in Json */
    function labelExtension(extor) {
        var labelDelivered;
        if (extor == "") {
            labelDelivered = "";
        } else if (extor == ".js") {
            labelDelivered = "Document Javascript";
        } else if (extor == ".html") {
            labelDelivered = "Document HTML";
        } else if (extor == ".txt") {
            labelDelivered = "Document texte";
        } else if (extor == ".png" || extor == ".jpeg" || extor == ".jpg" || extor == ".tiff" || extor == ".ico" || extor == ".gif" || extor == ".bmp" || extor == ".svg") {
            labelDelivered = "image";
        } else if (extor == ".mov" || extor == ".mkv") {
            labelDelivered = "Video";
        } else if (extor == ".xls" || extor == ".xlsx") {
            labelDelivered = "Feuille de calcul";
        } else if (extor == ".doc" || extor == ".docx") {
            labelDelivered = "Document";
        } else if (extor == ".ppt" || extor == ".pptx") {
            labelDelivered = "Diaporama";
        } else if (extor == ".pdf") {
            labelDelivered = "Document PDF";
        } else if (extor == ".cad") {
            labelDelivered = "Diagramme Picaxe";
        } else {
            labelDelivered = "fichier";
        }

        return labelDelivered;
    }

    /** System icon for files and folder in datatable list. 
     * Possible to add here new icon for file Type... 
     * @param {string} extor is the extension string
     */
    function iconExt(extor) {
        var icoDelivered = "";
        if (extor == "") {
            icoDelivered = "ico_folder";
        } else if (extor == ".js") {
            icoDelivered = "ico_js";
        } else if (extor == ".html") {
            icoDelivered = "ico_html";
        } else if (extor == ".txt") {
            icoDelivered = "ico_txt";
        } else if (extor == ".png" || extor == ".jpeg" || extor == ".jpg" || extor == ".tiff" || extor == ".ico" || extor == ".gif" || extor == ".bmp" || extor == ".svg") {
            icoDelivered = "icoPic";
        } else if (extor == ".mov" || extor == ".mkv") {
            icoDelivered = "ico_vid";
        } else if (extor == ".xls" || extor == ".xlsx") {
            icoDelivered = "ico_xls";
        } else if (extor == ".doc" || extor == ".docx") {
            icoDelivered = "ico_doc";
        } else if (extor == ".ppt" || extor == ".pptx") {
            icoDelivered = "ico_ppt";
        } else if (extor == ".pdf") {
            icoDelivered = "ico_pdf";
        } else if (extor == ".cad") {
            icoDelivered = "ico_cad";
        } else {
            icoDelivered = "ico_else";
        }

        return icoDelivered;

    }

    /** identify volume type */
    function volType(volToFix) {
        var volType;
        if (volToFix.includes("cdRom")) {
            volType = "ico_CDrom ";
        } else if (volToFix.includes("sdCard")) {
            volType = "ico_sdCard ";
        } else if (volToFix.includes("usb")) {
            volType = "ico_usb ";
        } else {
            volType = "icoHdrive";
        }

        return volType;
    }

    /** Get complete path from origin. Usefull to calculate if the volume as enough space */
    function originPath(treeFolder, idNode) {
        var oPath;
        for (var i = 0; i < treeFolder.length; i++) {
            if (treeFolder[i].id == idNode) {
                oPath = treeFolder[i].data.originalPath;
            }
        }
        return oPath;
    }

    return {

        byte: function(size) {
            var byteSize = bytUnit(size);
            return byteSize;
        },
        euroDate: function(isodate) {
            var Edate = setEurodate(isodate);
            return Edate;
        },
        getLabelExt: function(extor) {
            var extLabel = labelExtension(extor);
            return extLabel;
        },
        getIconExt: function(exto) {
            var extoIco = iconExt(exto);
            return extoIco;
        },
        getVolType: function(volToFix) {
            var volfixer = volType(volToFix);
            return volfixer;
        },
        getOriginalPath: function(treeFolder, idNode) {
            var oripath = originPath(treeFolder, idNode)
            return oripath;
        }
    };

});
//end Main function