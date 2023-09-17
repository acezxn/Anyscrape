
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

window.electronAPI.handleTestResult((event, data) => {
    const test_result_display = document.getElementById("test_result_display");
    test_result_display.value = data;
    document.getElementById("test_button").disabled = false;
});

/**
 * Generate export dictionary
 *
 * @returns {*} export dictionary
 */
function gen_export_dict() {
    const tag_name_enable       = document.getElementById("tag_name_enable");
    const tag_class_enable      = document.getElementById("tag_class_enable");
    const tag_id_enable         = document.getElementById("tag_id_enable");
    const tag_type_enable       = document.getElementById("tag_type_enable");
    const tag_location_enable   = document.getElementById("tag_location_enable");
    const scrape_delay_input    = document.getElementById("scrape_delay_input");

    var export_dict = {
        tag_html     : "",
        tag_name     : "",
        tag_class    : "",
        tag_id       : "",
        tag_type     : "",
        tag_location : "",
        scrape_delay : "0",
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
    if (scrape_delay_input.value !== "" && /^[0-9]*$/.test(scrape_delay_input.value)) {
        export_dict.scrape_delay = +scrape_delay_input.value;
    }
    return export_dict;
}
/**
 * Handles export to json request
 *
 */
function handle_export() {
    let export_button = document.getElementById("export_button");
    export_button.href = "data:application/xml;charset=utf-8," + JSON.stringify(gen_export_dict());
    console.log("export");
}

/**
 * Sends search url to web viewer to load page
 *
 */
function send_search_url() {
    const url_input = document.getElementById("url_input");
    if (url_input.value !== "") {
        window.electronAPI.searchURL(url_input.value);
    }
}


/**
 * Detects special keypress on the searchbar
 *
 * @param {Event} e
 */
function searchbar_keypress(e) {
    if (e.keyCode === 13) {
        send_search_url();
    }
}

/**
 * Test the configuration by requesting to scrape
 *
 */
function test_scrape() {
    let url = document.getElementById("url_input").value;
    window.electronAPI.sendTestContent(gen_export_dict(), url);
    document.getElementById("test_button").disabled = true;
}

document.getElementById("export_button").addEventListener("click", handle_export);
document.getElementById("search_button").addEventListener("click", send_search_url);
document.getElementById("url_input").addEventListener("keypress", searchbar_keypress);
document.getElementById("test_button").addEventListener("click", test_scrape);