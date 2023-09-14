
window.electronAPI.handleElementData((event, data) => {
    const tag_name_input        = document.getElementById("tag_name_input");
    const tag_html_display      = document.getElementById("tag_html_display");
    const tag_class_input       = document.getElementById("tag_class_input");
    const tag_id_input          = document.getElementById("tag_id_input");
    const tag_type_input        = document.getElementById("tag_type_input");
    const tag_location_input    = document.getElementById("tag_location_input");

    const tag_name_enable       = document.getElementById("tag_name_enable");
    const tag_class_enable      = document.getElementById("tag_class_enable");
    const tag_id_enable         = document.getElementById("tag_id_enable");
    const tag_type_enable       = document.getElementById("tag_type_enable");
    const tag_location_enable   = document.getElementById("tag_location_enable");


    tag_html_display.value      = data.tag_html;
    tag_name_input.value        = data.tag_name;
    tag_class_input.value       = data.tag_class;
    tag_id_input.value          = data.tag_id;
    tag_type_input.value        = data.tag_type;
    tag_location_input.value    = data.tag_location;

    tag_name_enable.checked     = data.tag_name !== "";
    tag_class_enable.checked    = data.tag_class !== "";
    tag_id_enable.checked       = data.tag_id !== "";
    tag_type_enable.checked     =  data.tag_type !== "";
    tag_location_enable.checked = data.tag_location !== "";
});

function handle_export() {
    let export_button          = document.getElementById("export_button");
    const tag_name_enable      = document.getElementById("tag_name_enable");
    const tag_class_enable     = document.getElementById("tag_class_enable");
    const tag_id_enable        = document.getElementById("tag_id_enable");
    const tag_type_enable      = document.getElementById("tag_type_enable");
    const tag_location_enable  = document.getElementById("tag_location_enable");
    let export_dict = {
        tag_html     : "",
        tag_name     : "",
        tag_class    : "",
        tag_id       : "",
        tag_type     : "",
        tag_location : "",
    };

    export_dict.tag_html = tag_html_display.value;

    if (tag_name_enable.checked) {
        export_dict.tag_name = tag_name_input.value;
    }
    if (tag_class_enable.checked) {
        export_dict.tag_class = tag_class_input.value;
    }
    if (tag_id_enable.checked) {
        export_dict.tag_id = tag_id_input.value;
    }
    if (tag_type_enable.checked) {
        export_dict.tag_type = tag_type_input.value;
    }
    if (tag_location_enable.checked) {
        export_dict.tag_location = tag_location_input.value;
    }

    export_button.href = "data:application/xml;charset=utf-8," + JSON.stringify(export_dict);
    console.log("export");
}

document.getElementById("export_button").addEventListener("click", handle_export);