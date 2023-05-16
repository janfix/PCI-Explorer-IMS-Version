<div class="panel">
    <p><b>PCI conçue par Wiquid + DEPP </b></p>
    <p>Ministère de l'éducation nationale</p>
    <p>France</p>
    <p>Version 1.0.0</p>
    <p>IMS-1EdTech Version 2023</p>
    <p>Réalisation <a href='http://www.wiquid.fr' target="_blank">Wiquid</a></p>
</div>
<hr>
<div class="panel">
    <label for="" class="has-icon" style="font-size: 1em;font-weight: bold">{{__ "Importer Projet"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <div class="tooltip-content">{{__ "Rendez-vous sur le site : www.wiquid.fr/projects/depp/explogen pour générer le fichier Json et personnaliser votre arborescence."}}</div>
    <p class="parag">Vous pouvez construire votre projet depuis le générateur :
        <a href="http://www.wiquid.fr/projects/depp/explogen" target="_blank"> Générateur de fichiers et répertoires</a>, produire un fichier JSON et l'importer ici.
    </p>
    <!-- <input type="file" name="scriptImporter" value="Importer une arborescence" class="scriptImporter btn-info small"> -->
    <input type="file" name="jsonImport" value="Charger les données" class="jsonImport btn-info small" accept="application/JSON">
    <p style="font-size: 0.8em;">Pour tester votre PCI, passez en mode preview, ou bien sauvegardez l'item et ouvrez-le à nouveau pour le tester depuis l'éditeur.</p>
    <br>
    <hr>

    <!-- +++++++++++++++++++000+++++++++++++++++++ -->
    <!-- <label for="" class="has-icon" style="font-size: 1em; font-weight: bold;">{{__ "Sauver vos modifications"}}</label>
    <button type="button" name="saveExploState" id="saveExploState" class=" saveExploState btn-info small">Enreg. vos modifications</button> -->


    <div>
        <hr>
        <div class="panel">
            <label for="" class="has-icon">{{__ "Response identifier"}}</label>
            <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
            <div class="tooltip-content">{{__ 'The identifier of the choice. This identifier must not be used by any other response or item variable. An identifier is a string of characters that must start with a Letter or an underscore ("_") and contain only Letters, underscores,
                hyphens ("-"), period (".", a.k.a. full-stop), Digits, CombiningChars and Extenders.'}}</div>

            <input type="text" name="identifier" value="{{identifier}}" placeholder="e.g. RESPONSE" data-validate="$notEmpty; $qtiIdentifier; $availableIdentifier(serial={{serial}});">
        </div>