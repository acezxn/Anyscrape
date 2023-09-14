
console.log(window.electronAPI);
window.electronAPI.handleElementData((event, data) => {
    const tag_name_input   = document.getElementById("tag_name_input");
    const tag_html_display = document.getElementById("tag_html_display");
    const tag_class_input  = document.getElementById("tag_class_input");
    const tag_id_input     = document.getElementById("tag_id_input");
    const tag_type_input   = document.getElementById("tag_type_input");

    console.log(data);

    tag_html_display.value = data.tag_html;
    tag_name_input.value   = data.tag_name;
    tag_class_input.value  = data.tag_class;
    tag_id_input.value     = data.tag_id;
    tag_type_input.value  = data.tag_type;
});