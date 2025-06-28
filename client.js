let icon;

const text_inputs = [
  "ext_name",
  "ext_id",
  "ext_version",
  "default_locale",
  "ext_desc",
  "auth_name",
  "auth_email",
  "auth_org",
  "auth_site",
  "ext_url",
  "api_version"
];

const versions = {
  "1.0": `<?xml version="1.0" encoding="utf-8"?> 
  <manifest manifest-version="0.1" xmlns="http://www.tableau.com/xml/extension_manifest">
    <dashboard-extension id="{{ext_id}}" extension-version="{{ext_version}}">
      <default-locale>{{default_locale}}</default-locale>
      <name resource-id="name"/>
      <description>{{ext_desc}}</description>
      <author name="{{auth_name}}" email="{{auth_email}}" organization="{{auth_org}}" website="{{auth_site}}"/>
      <min-api-version>{{api_version}}</min-api-version>
      <source-location>
        <url>{{ext_url}}</url> 
      </source-location>
      <icon>{{icon}}</icon>{{full_data}}{{context_menu}}
    </dashboard-extension>
    <resources>
      <resource id="name">
        <text locale="{{default_locale}}">{{ext_name}}</text>
      </resource>
    </resources>
  </manifest>`
};

function generate() {
  for (let i of document.getElementsByTagName("input")) {
    $("#" + i.id).removeClass("is-invalid");
  }
  $("#generator").addClass("was-validated");
  validateAll();
}

function validateEmail() {
  const auth_email = $("#auth_email").val();
  const rgx = /^(^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)$/i;

  if (!rgx.test(auth_email) || $("#auth_email").val() == "") {
    $("#auth_email").addClass("is-invalid");
    $("#auth_email_invalid").html("Please enter a valid email address");
    return true;
  }

  return false;
}

function validateID() {
  const ext_id = $("#ext_id").val();
  const rgx = /^([A-Za-z]{2,6}(\.[A-Za-z0-9\-]{1,63})+)$/i;

  if (ext_id == "") {
    $("#ext_id").addClass("is-invalid");
    $("#ext_id_invalid").html("You must enter an extension ID");
    return true;
  }

  if (!rgx.test(ext_id)) {
    $("#ext_id").addClass("is-invalid");
    $("#ext_id_invalid").html(
      "ID must follow reverse domain name pattern with no special characters."
    );
    return true;
  }

  return false;
}

function validateExtensionURL() {
  const ext_url = $("#ext_url").val();
  const rgx = /^(((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?))$/i;

  if (ext_url == "") {
    $("#ext_url").addClass("is-invalid");
    $("#ext_url_invalid").html("You must enter a URL for your extension.");
    return true;
  }

  if (!rgx.test(ext_url)) {
    $("#ext_url").addClass("is-invalid");
    $("#ext_url_invalid").html("You must use a valid URL.");
    return true;
  }

  if (
    ext_url.substring(0, 5) != "https" &&
    ext_url.substring(0, 16) != "http://localhost"
  ) {
    $("#ext_url").addClass("is-invalid");
    $("#ext_url_invalid").html(
      "You must use HTTPS if you are not on localhost."
    );
    return true;
  }

  return false;
}

function validateAuthorURL() {
  const auth_site = $("#auth_site").val();
  const rgx = /^(((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?))$/i;

  if (auth_site == "") {
    $("#auth_site").addClass("is-invalid");
    $("#auth_site_invalid").html("You must enter a URL.");
    return true;
  }

  if (!rgx.test(auth_site)) {
    $("#auth_site").addClass("is-invalid");
    $("#auth_site_invalid").html("You must use a valid URL.");
    return true;
  }

  if (auth_site.substring(0, 5) != "https") {
    $("#auth_site").addClass("is-invalid");
    $("#auth_site_invalid").html("URL must be on HTTPS.");
    return true;
  }

  return false;
}

function validateAll() {
  let err =
    (validateID() ? 1 : 0) +
    (validateEmail() ? 1 : 0) +
    (validateExtensionURL() ? 1 : 0) +
    (validateAuthorURL() ? 1 : 0);

  if (err === 0) {
    getTemplate();
  }
}

function clearError(input) {
  $("#" + input.id).removeClass("is-invalid");
}

function getTemplate() {
  // let inputs = {};
  // if ($("#share").is(":checked")) {
  //   for (let input of text_inputs) {
  //     inputs[input] = $(`#${input}`).val();
  //   }
  // } else {
  //   inputs = { api_version: $("#api_version").val() };
  // }

  // $.post("/", inputs, template => {
  //   fillTemplate(template);
  // });

  const version = $("#api_version").val();
  const template = versions[version];
  fillTemplate(template);
}

function previewFile() {
  var file = $("#icon")[0].files[0];
  var reader = new FileReader();

  reader.addEventListener(
    "load",
    function() {
      $("#preview").attr("src", reader.result);
      icon = reader.result.substring(reader.result.search(",") + 1);
    },
    false
  );
  if (file) {
    reader.readAsDataURL(file);
  }
}

function parseTREX() {
  var file = $("#upload_trex")[0].files[0];
  var reader = new FileReader();

  reader.addEventListener(
    "load",
    function() {
      let parser = new DOMParser();
      let trex = parser.parseFromString(reader.result, "application/xml");
      $("#ext_name").val(
        trex.getElementsByTagName("text")[0].childNodes[0].nodeValue
      );
      $("#ext_id").val(trex.getElementsByTagName("dashboard-extension")[0].id);
      $("#default_locale").val(
        trex.getElementsByTagName("text")[0].attributes.locale.nodeValue
      );
      $("#ext_desc").val(
        trex.getElementsByTagName("description")[0].childNodes[0].nodeValue
      );
      $("#auth_name").val(
        trex.getElementsByTagName("author")[0].attributes.name.nodeValue
      );
      $("#auth_email").val(
        trex.getElementsByTagName("author")[0].attributes.email.nodeValue
      );
      $("#auth_org").val(
        trex.getElementsByTagName("author")[0].attributes.organization.nodeValue
      );
      $("#auth_site").val(
        trex.getElementsByTagName("author")[0].attributes.website.nodeValue
      );
      $("#ext_url").val(
        trex.getElementsByTagName("url")[0].childNodes[0].nodeValue
      );
      $("#ext_version").val(
        trex.getElementsByTagName("dashboard-extension")[0].attributes[
          "extension-version"
        ].nodeValue
      );
      $("#full_data").prop(
        "checked",
        trex.getElementsByTagName("permissions").length > 0
      );
      $("#context_menu").prop(
        "checked",
        trex.getElementsByTagName("context-menu").length > 0
      );
      $("#preview").attr(
        "src",
        "data:image/png;base64," +
          trex.getElementsByTagName("icon")[0].childNodes[0].nodeValue
      );
      icon = trex.getElementsByTagName("icon")[0].childNodes[0].nodeValue;
    },
    false
  );
  if (file) {
    reader.readAsText(file);
  }
}

function fillTemplate(template) {
  const xml = /[<>"'&]/;
  const full_data =
    "\n      <permissions>\n        <permission>full data</permission>\n      </permissions>";
  const context_menu =
    "\n      <context-menu>\n        <configure-context-menu-item />\n      </context-menu>";

  for (let input of text_inputs) {
    template = template.split(`{{${input}}}`).join(
      $(`#${input}`)
        .val()
        .replace(xml, "")
    );
  }

  template = template
    .replace("{{full_data}}", $("#full_data").is(":checked") ? full_data : "")
    .replace(
      "{{context_menu}}",
      $("#context_menu").is(":checked") ? context_menu : ""
    )
    .replace("{{icon}}", icon ? icon : "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  $("#out").html(template);

  download();
}

function download() {
  const filename = $("#ext_name")
    .val()
    .replace(/[^a-z0-9]/gi, "_")
    .replace(/_+/gi, "_")
    .toLowerCase();
  
  let output = $("#out").html();
  output = output
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/#/g, "%23");
  
  if (navigator.msSaveBlob) {
    // IE 10+
    var exportedFilenmae = `ext_${filename}.trex`;
    var blob = new Blob([output], { type: "text/xml;" });
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    let a = document.body.appendChild(document.createElement("a"));
    a.download = `ext_${filename}.trex`;
    a.href = "data:text/xml," + output;
    a.click();
    a.parentNode.removeChild(a);
  }
}

$(function() {
  $("#ext_url").focusout(function() {
    clearError(this);
    validateExtensionURL();
  });
  $("#auth_site").focusout(function() {
    clearError(this);
    validateAuthorURL();
  });
  $("#auth_email").focusout(function() {
    clearError(this);
    validateEmail();
  });
  $("#ext_id").focusout(function() {
    clearError(this);
    validateID();
  });
});
