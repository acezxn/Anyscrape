
window.electronAPI.sendElementDataToRenderer((event, tag_data) => {
    const filter_settings = document.getElementById("filter_settings");
    const tag_html_display = document.getElementById("tag_html_display");

    filter_settings.innerHTML = "";
    tag_html_display.value = tag_data.html;

    let tag_name_label = document.createElement("label");
    let tag_name_input = document.createElement("input");
    let tag_name_checkbox = document.createElement("input");
    let tag_name_checkbox_label = document.createElement("small");
    let tag_name_new_line = document.createElement("br");
    let tag_name_separator = document.createElement("div");

    let tag_location_label = document.createElement("label");
    let tag_location_input = document.createElement("input");
    let tag_location_checkbox = document.createElement("input");
    let tag_location_checkbox_label = document.createElement("small");
    let tag_location_new_line = document.createElement("br");
    let tag_location_separator = document.createElement("div");

    tag_name_label.innerHTML = "Tag name:";
    tag_name_input.type = "text";
    tag_name_input.id = "tag_name_filter";
    tag_name_input.value = tag_data.tag_name;
    tag_name_checkbox.checked = true;
    tag_name_checkbox.type = "checkbox";
    tag_name_checkbox.id = "tag_name_enable";
    tag_name_checkbox_label.innerHTML = "Enable";
    tag_name_separator.className = "separator";

    tag_location_label.innerHTML = "Tag location:";
    tag_location_input.type = "text";
    tag_location_input.id = "tag_location_filter";
    tag_location_input.value = tag_data.location;
    tag_location_checkbox.checked = tag_data.location !== "";
    tag_location_checkbox.type = "checkbox";
    tag_location_checkbox.id = "tag_location_enable";
    tag_location_checkbox_label.innerHTML = "Enable";
    tag_location_separator.className = "separator";

    filter_settings.appendChild(tag_name_label);
    filter_settings.appendChild(tag_name_input);
    filter_settings.appendChild(tag_name_checkbox);
    filter_settings.appendChild(tag_name_checkbox_label);
    filter_settings.appendChild(tag_name_new_line);
    filter_settings.appendChild(tag_name_separator);

    for (const [attr, value] of Object.entries(tag_data.attributes)) {
        let attr_label = document.createElement("label");
        let attr_input = document.createElement("input");
        let attr_checkbox = document.createElement("input");
        let checkbox_label = document.createElement("small");
        let new_line = document.createElement("br");
        let separator = document.createElement("div");

        attr_label.innerHTML = attr;
        attr_input.type = "text";
        attr_input.id = attr + "_filter";
        attr_input.value = value;
        attr_checkbox.checked = true;
        attr_checkbox.type = "checkbox";
        attr_checkbox.id = attr + "_enable";
        checkbox_label.innerHTML = "Enable";
        separator.className = "separator";

        filter_settings.appendChild(attr_label);
        filter_settings.appendChild(attr_input);
        filter_settings.appendChild(attr_checkbox);
        filter_settings.appendChild(checkbox_label);
        filter_settings.appendChild(new_line);
        filter_settings.appendChild(separator);
    }

    filter_settings.appendChild(tag_location_label);
    filter_settings.appendChild(tag_location_input);
    filter_settings.appendChild(tag_location_checkbox);
    filter_settings.appendChild(tag_location_checkbox_label);
    filter_settings.appendChild(tag_location_new_line);
    filter_settings.appendChild(tag_location_separator);
});

window.electronAPI.sendCurrentURLToRenderer((event, url) => {
    const url_input = document.getElementById("url_input");
    url_input.value = url;
});
window.electronAPI.sendCookieDataToRenderer((event, cookie_data) => {
    const cookies_display = document.getElementById("cookies_display");
    let cookie_dict = {
        cookies: cookie_data
    };
    cookies_display.value = JSON.stringify(cookie_dict, null, 4);
});

window.electronAPI.sendTestResultToRenderer((event, data) => {
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
    const filter_settings = document.getElementById("filter_settings");
    const scrape_delay = document.getElementById("scrape_delay_input");
    const cookies_display = document.getElementById("cookies_display");
    const use_cookies_input = document.getElementById("use_cookies_input");

    var export_dict = {
        filters: {}
    };

    for (let child of filter_settings.childNodes) {
        if (child.tagName === "INPUT") {
            if (child.type === "text") {
                export_dict.filters[child.id] = child.value;
            }
            else if (child.type === "checkbox" && !child.checked) {
                delete export_dict.filters[child.id.replace("_enable", "_filter")];
            }
        }
    }

    if (/^[0-9]*$/.test(scrape_delay.value)) {
        export_dict["scrape_delay"] = +scrape_delay.value;
    }

    if (use_cookies_input.checked) {
        export_dict["cookies"] = JSON.parse(cookies_display.value).cookies;
    }

    return export_dict;
}

function open_manual() {
    window.electronAPI.openManual();
}
/**
 * Handles export to json request
 *
 */
function handle_export() {
    let export_button = document.getElementById("export_button");
    export_button.href = "data:application/xml;charset=utf-8," + JSON.stringify(gen_export_dict());
}

/**
 * Sends search url to web viewer to load page
 *
 */
function send_search_url() {
    const url_input = document.getElementById("url_input");
    if (url_input.value !== "") {
        window.electronAPI.sendSearchURLToMain(url_input.value);
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
    window.electronAPI.sendTestContentToMain(gen_export_dict(), url);
    document.getElementById("test_button").disabled = true;
}

document.getElementById("manual_button").addEventListener("click", open_manual);
document.getElementById("export_button").addEventListener("click", handle_export);
document.getElementById("search_button").addEventListener("click", send_search_url);
document.getElementById("url_input").addEventListener("keypress", searchbar_keypress);
document.getElementById("test_button").addEventListener("click", test_scrape);
