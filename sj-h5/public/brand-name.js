(function () {
  "use strict";

  var brandPattern = /JNMIA|TikTok/gi;
  var mallPattern = /TikTok Shop Mall/gi;
  var replacement = "TTK";
  var mallReplacement = "TTK Shop";
  var textWalker = document.createTreeWalker(
    document.documentElement,
    NodeFilter.SHOW_TEXT
  );
  var skippedTags = { SCRIPT: true, STYLE: true, NOSCRIPT: true };
  var attributes = ["title", "alt", "placeholder", "aria-label"];
  var hiddenLanguages = {
    "русский": true,
    "italiano": true,
    "afrikaans": true,
    "ελληνικά": true,
    "简体中文": true,
    "中文简体": true,
    "türkçe": true,
    "日本語": true,
    "한국어": true,
    "ภาษาไทย": true,
    "عربي": true,
    "العربية": true,
    "tiếng việt": true,
    "हिंदी": true,
    "हिन्दी": true,
    "bahasa indonesia": true,
    "indonesia": true
  };
  var emailVerificationCode = "";
  var originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (typeof url === "string" && /registerNoVerifcode\.action/i.test(url) && !/[?&]verifcode=/.test(url)) {
      url += (url.indexOf("?") === -1 ? "?" : "&") + "verifcode=" + encodeURIComponent(emailVerificationCode);
    }
    var args = Array.prototype.slice.call(arguments);
    args[1] = url;
    return originalXhrOpen.apply(this, args);
  };

  function setFavicon() {
    var icon = document.querySelector("link[rel~='icon']");
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.type = "image/png";
    icon.href = "./site-favicon.png?v=20261026-ttk";
  }

  function replaceText(root) {
    var walker = root === document.documentElement
      ? textWalker
      : document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;

    while ((node = walker.nextNode())) {
      if (
        node.parentElement &&
        !skippedTags[node.parentElement.tagName] &&
        (brandPattern.test(node.nodeValue) || mallPattern.test(node.nodeValue))
      ) {
        brandPattern.lastIndex = 0;
        mallPattern.lastIndex = 0;
        node.nodeValue = node.nodeValue
          .replace(mallPattern, mallReplacement)
          .replace(brandPattern, replacement);
      }
      brandPattern.lastIndex = 0;
      mallPattern.lastIndex = 0;
    }
  }

  function replaceAttributes(root) {
    var elements = [];
    if (root.nodeType === Node.ELEMENT_NODE) {
      elements.push(root);
    }
    if (root.querySelectorAll) {
      elements = elements.concat(Array.prototype.slice.call(
        root.querySelectorAll("[title],[alt],[placeholder],[aria-label]")
      ));
    }

    elements.forEach(function (element) {
      attributes.forEach(function (attribute) {
        var value = element.getAttribute(attribute);
        if (value && (brandPattern.test(value) || mallPattern.test(value))) {
          brandPattern.lastIndex = 0;
          mallPattern.lastIndex = 0;
          element.setAttribute(
            attribute,
            value.replace(mallPattern, mallReplacement).replace(brandPattern, replacement)
          );
        }
        brandPattern.lastIndex = 0;
        mallPattern.lastIndex = 0;
      });
    });
  }

  function hideUnsupportedLanguages(root) {
    if (!root.querySelectorAll) {
      return;
    }
    var selector = "li,[role='menuitem'],option,.van-cell,.language-item,.lang-item,.language-content .item";
    var elements = Array.prototype.slice.call(root.querySelectorAll(selector));
    if (root.matches && root.matches(selector)) {
      elements.unshift(root);
    }
    elements.forEach(function (element) {
      var name = (element.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (!hiddenLanguages[name]) {
        return;
      }
      var target = element.closest("li,[role='menuitem'],option,.van-cell,.language-item,.lang-item,.language-content .item") || element;
      target.style.display = "none";
      target.setAttribute("data-language-disabled", "true");
      if (target.tagName === "OPTION") {
        target.disabled = true;
      }
    });
  }

  function customizeMerchantApplication() {
    var pageLocation = window.location.hash + window.location.pathname;
    if (!/merchantSettled/i.test(pageLocation) && !/\/promote\/?/i.test(window.location.pathname)) {
      return;
    }

    var labels = {
      "store address": "Home Address",
      "shop address": "Home Address",
      "dirección de la tienda": "Dirección particular",
      "endereço da loja": "Endereço residencial",
      "店铺地址": "家庭住址",
      "id/passport photo upload": "Upload front and back of ID",
      "subida de foto de dni/pasaporte": "Suba el anverso y reverso del documento",
      "upload de foto de identidade/passaporte": "Envie a frente e o verso do documento",
      "证件照/上传护照": "上传证件正反面"
    };
    var hiddenLabels = {
      "country": true,
      "país": true,
      "国家": true,
      "id/passport number": true,
      "número de dni/pasaporte": true,
      "número de identificação/passaporte": true,
      "证件/护照号码": true,
      "full name": true,
      "legal name": true,
      "nombre completo": true,
      "nome completo": true,
      "真实姓名": true
    };
    var handheldLabels = {
      "hold up the document next to your face": true,
      "sostenga el documento al lado de su cara.": true,
      "segure o documento próximo ao seu rosto": true,
      "手持证件照": true
    };

    Array.prototype.forEach.call(document.querySelectorAll(".el-form-item__label"), function (label) {
      var name = (label.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (hiddenLabels[name]) {
        var item = label.closest(".el-form-item");
        if (item) {
          item.style.display = "none";
        }
      } else if (labels[name]) {
        label.textContent = labels[name];
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll(".uploder-two-wrap .tips"), function (tip) {
      var name = (tip.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (handheldLabels[name]) {
        var item = tip.closest(".uploder-two-wrap");
        if (item) {
          item.style.display = "none";
        }
      }
    });

    var thirdExample = document.querySelector(".correct-warp img:nth-child(3)");
    if (thirdExample) {
      thirdExample.style.display = "none";
    }

    Array.prototype.forEach.call(document.querySelectorAll("input[placeholder]"), function (input) {
      var placeholder = input.getAttribute("placeholder");
      var normalized = (placeholder || "").toLowerCase();
      if (normalized.indexOf("store address") !== -1) {
        input.setAttribute("placeholder", "Please enter your home address");
      } else if (normalized.indexOf("dirección de la tienda") !== -1) {
        input.setAttribute("placeholder", "Ingrese su dirección particular");
      } else if (normalized.indexOf("endereço da loja") !== -1) {
        input.setAttribute("placeholder", "Insira seu endereço residencial");
      }
    });

    var merchantVm = null;
    function updateViewModel(vm) {
      if (!vm) {
        return;
      }
      if (vm.ruleForm && typeof vm.sellerRegister === "function") {
        merchantVm = vm;
        vm.ruleForm.name = "-";
        vm.ruleForm.idnumber = "-";
        vm.ruleForm.country = "-";
        vm.ruleForm.nationality = "-";
      }
      Array.prototype.forEach.call(vm.$children || [], updateViewModel);
    }
    var app = document.getElementById("app");
    if (app && app.__vue__) {
      updateViewModel(app.__vue__);
    }

    if (
      merchantVm &&
      typeof merchantVm.paperworkAfterRead === "function" &&
      !document.querySelector(".merchant-document-upload") &&
      !document.querySelector(".uploder-center")
    ) {
      var form = merchantVm.$refs && merchantVm.$refs.ruleForm
        ? merchantVm.$refs.ruleForm.$el
        : document.querySelector(".demo-ruleForm");
      if (form) {
        var langMatch = window.location.hash.match(/[?&]lang=([^&]+)/i);
        var lang = langMatch ? decodeURIComponent(langMatch[1]).toLowerCase() : "en";
        var uploadWords = lang.indexOf("es") === 0
          ? { title: "Suba el anverso y reverso del documento", front: "Anverso", back: "Reverso", uploading: "Subiendo...", uploaded: "Subido", failed: "Error al subir" }
          : lang.indexOf("pt") === 0
            ? { title: "Envie a frente e o verso do documento", front: "Frente", back: "Verso", uploading: "Enviando...", uploaded: "Enviado", failed: "Falha no envio" }
            : { title: "Upload front and back of ID", front: "Front of ID", back: "Back of ID", uploading: "Uploading...", uploaded: "Uploaded", failed: "Upload failed" };
        var uploadItem = document.createElement("div");
        uploadItem.className = "el-form-item is-required merchant-document-upload";
        uploadItem.innerHTML =
          '<label class="el-form-item__label" style="width:100%;text-align:left">' + uploadWords.title + '</label>' +
          '<div class="el-form-item__content" style="margin-left:0!important;width:100%;display:flex;justify-content:flex-start;gap:12px;flex-wrap:wrap">' +
          '<label style="display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer">' +
          '<span style="display:flex;width:96px;height:72px;border:1px dashed #c0ccda;border-radius:6px;align-items:center;justify-content:center">' + uploadWords.front + '</span>' +
          '<input data-id-side="1" type="file" accept="image/png,image/jpg,image/jpeg" style="display:none">' +
          '<small data-id-status="1"></small></label>' +
          '<label style="display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer">' +
          '<span style="display:flex;width:96px;height:72px;border:1px dashed #c0ccda;border-radius:6px;align-items:center;justify-content:center">' + uploadWords.back + '</span>' +
          '<input data-id-side="2" type="file" accept="image/png,image/jpg,image/jpeg" style="display:none">' +
          '<small data-id-status="2"></small></label></div>';

        var nameItem = null;
        Array.prototype.some.call(form.querySelectorAll(".el-form-item"), function (item) {
          var label = item.querySelector(".el-form-item__label");
          var text = (label && label.textContent || "").trim().toLowerCase();
          if (hiddenLabels[text] && (text === "legal name" || text === "full name" || text === "nombre completo" || text === "nome completo" || text === "真实姓名")) {
            nameItem = item;
            return true;
          }
          return false;
        });
        form.insertBefore(uploadItem, nameItem || form.lastChild);

        Array.prototype.forEach.call(uploadItem.querySelectorAll("input[data-id-side]"), function (input) {
          input.addEventListener("change", function () {
            var file = input.files && input.files[0];
            if (!file) {
              return;
            }
            var side = Number(input.getAttribute("data-id-side"));
            var status = uploadItem.querySelector('[data-id-status="' + side + '"]');
            if (status) {
              status.textContent = uploadWords.uploading;
            }
            merchantVm.paperworkAfterRead({ file: file, content: URL.createObjectURL(file) }, side);
            var checks = 0;
            var uploadTimer = window.setInterval(function () {
              checks += 1;
              if (merchantVm.ruleForm["idimg_" + side]) {
                window.clearInterval(uploadTimer);
                if (status) {
                  status.textContent = uploadWords.uploaded;
                }
              } else if (checks >= 20) {
                window.clearInterval(uploadTimer);
                if (status) {
                  status.textContent = uploadWords.failed;
                }
              }
            }, 500);
          });
        });
      }
    }
  }

  function getEmailVerificationWords(registerVm) {
    var locale = "en";
    try {
      locale = ((registerVm.$i18n && registerVm.$i18n.locale) || localStorage.getItem("language") || "en").toLowerCase();
    } catch (ignore) {}

    if (locale.indexOf("tw") === 0 || locale.indexOf("zh-tw") === 0 || locale.indexOf("zh_hk") === 0) {
      return { label: "驗證碼", placeholder: "請輸入驗證碼", send: "獲取驗證碼", sending: "發送中...", sent: "已發送", failed: "發送失敗", email: "請輸入有效的電子郵箱" };
    }
    if (locale.indexOf("cn") === 0 || locale.indexOf("zh-cn") === 0 || locale.indexOf("zh_cn") === 0) {
      return { label: "验证码", placeholder: "请输入验证码", send: "获取验证码", sending: "发送中...", sent: "已发送", failed: "发送失败", email: "请输入有效的电子邮箱" };
    }
    if (locale.indexOf("es") === 0) {
      return { label: "Código de verificación", placeholder: "Ingrese el código", send: "Obtener código", sending: "Enviando...", sent: "Enviado", failed: "Error al enviar", email: "Introduzca un correo válido" };
    }
    if (locale.indexOf("pt") === 0) {
      return { label: "Código de verificação", placeholder: "Digite o código", send: "Obter código", sending: "Enviando...", sent: "Enviado", failed: "Falha no envio", email: "Digite um e-mail válido" };
    }
    return { label: "Verification code", placeholder: "Enter verification code", send: "Get code", sending: "Sending...", sent: "Sent", failed: "Failed to send", email: "Enter a valid email" };
  }

  function customizeEmailRegistration() {
    var pageLocation = window.location.pathname + window.location.hash;
    if (!/register/i.test(pageLocation)) {
      return;
    }

    var registerVm = null;
    function findRegisterVm(vm) {
      if (!vm || registerVm) {
        return;
      }
      if (vm.formData && typeof vm.post_form === "function") {
        registerVm = vm;
      } else if (vm.registerModel && typeof vm.registerEvent === "function") {
        registerVm = vm;
      }
      Array.prototype.forEach.call(vm.$children || [], findRegisterVm);
    }
    var app = document.getElementById("app");
    if (app && app.__vue__) {
      findRegisterVm(app.__vue__);
    }
    if (!registerVm) {
      return;
    }

    var isMobileForm = !!registerVm.formData;
    var componentName = registerVm.$options && registerVm.$options.name;
    var isPhoneRegistration = (isMobileForm && registerVm.TabShow !== 2) || componentName === "EsMobileForm";
    if (isPhoneRegistration) {
      var oldMobileBox = document.querySelector(".email-verification-runtime");
      if (oldMobileBox) {
        oldMobileBox.remove();
      }

      // The legacy mobile bundle renders the phone verification controls even
      // though phone registration no longer requires a code. Hide only those
      // controls; email registration remains handled below.
      var phoneForm = isMobileForm ? document.querySelector(".phone_form") : null;
      if (phoneForm) {
        Array.prototype.forEach.call(phoneForm.querySelectorAll(".code_btn_txt"), function (sendButton) {
          sendButton.style.display = "none";
        });
        Array.prototype.forEach.call(phoneForm.querySelectorAll('input[maxlength="6"]'), function (codeInput) {
          var inputBox = codeInput.closest ? codeInput.closest(".el-input") : codeInput.parentElement;
          var codeRow = inputBox && inputBox.parentElement;
          if (codeRow) {
            codeRow.style.display = "none";
            var codeTitle = codeRow.previousElementSibling;
            if (codeTitle && codeTitle.classList.contains("title-input")) {
              codeTitle.style.display = "none";
            }
          }
        });
      }
      return;
    }
    var words = getEmailVerificationWords(registerVm);
    var existingBox = document.querySelector(".email-verification-runtime");
    if (existingBox) {
      var existingLabel = existingBox.querySelector("[data-email-code-label]");
      var existingInput = existingBox.querySelector("input");
      var existingButton = existingBox.querySelector("button");
      if (existingLabel && existingLabel.textContent !== words.label) {
        existingLabel.textContent = words.label;
      }
      if (existingInput && existingInput.placeholder !== words.placeholder) {
        existingInput.placeholder = words.placeholder;
      }
      if (existingButton && !existingButton.disabled && existingButton.textContent !== words.send) {
        existingButton.textContent = words.send;
      }
      return;
    }

    var box = document.createElement("div");
    box.className = "email-verification-runtime";
    box.innerHTML =
      '<div data-email-code-label style="font-size:14px;margin:14px 0 8px">' + words.label + '</div>' +
      '<div style="display:flex;gap:8px;align-items:center">' +
      '<input type="text" inputmode="numeric" maxlength="6" placeholder="' + words.placeholder + '" style="box-sizing:border-box;min-width:0;flex:1;height:40px;padding:0 12px;border:1px solid #dcdfe6;border-radius:4px">' +
      '<button type="button" style="height:40px;padding:0 14px;border:0;border-radius:4px;background:#ee1d52;color:#fff;white-space:nowrap;cursor:pointer">' + words.send + '</button>' +
      '<small style="display:none"></small></div>';

    var input = box.querySelector("input");
    var button = box.querySelector("button");
    input.addEventListener("input", function () {
      input.value = input.value.replace(/\D/g, "").slice(0, 6);
      emailVerificationCode = input.value;
      if (registerVm.formData) {
        registerVm.formData.verifcode = input.value;
      }
      if (registerVm.registerModel) {
        registerVm.registerModel.verifcode = input.value;
      }
    });

    button.addEventListener("click", function () {
      var words = getEmailVerificationWords(registerVm);
      var email = registerVm.formData ? registerVm.formData.username : registerVm.registerModel.username;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) {
        window.alert(words.email);
        return;
      }
      button.disabled = true;
      button.textContent = words.sending;
      // The public API is served by the /wap context for both desktop and
      // mobile storefronts. The root /api path is a Tomcat 404 page.
      var endpoint = "/wap/api/jscode!execute.action";
      window.fetch(endpoint + "?target=" + encodeURIComponent(email), { method: "POST", credentials: "same-origin" })
        .then(function (response) {
          return response.text().then(function (body) {
            var result;
            try {
              result = JSON.parse(body);
            } catch (ignore) {
              throw new Error(words.failed);
            }
            if (!response.ok) {
              throw new Error(result.msg || words.failed);
            }
            return result;
          });
        })
        .then(function (result) {
          if (String(result.code) !== "0") {
            throw new Error(result.msg || words.failed);
          }
          var seconds = 60;
          button.textContent = words.sent + " (" + seconds + "s)";
          var timer = window.setInterval(function () {
            seconds -= 1;
            button.textContent = words.sent + " (" + seconds + "s)";
            if (seconds <= 0) {
              window.clearInterval(timer);
              button.disabled = false;
              button.textContent = words.send;
            }
          }, 1000);
        })
        .catch(function (error) {
          button.disabled = false;
          button.textContent = words.send;
          window.alert(error.message || words.failed);
        });
    });

    if (isMobileForm) {
      var mobileContainer = document.querySelector(".phone_form");
      var mobileTitles = mobileContainer ? mobileContainer.querySelectorAll(".title-input") : [];
      var mobilePasswordTitle = mobileTitles.length ? mobileTitles[mobileTitles.length - 2] : null;
      if (mobileContainer) {
        mobileContainer.insertBefore(box, mobilePasswordTitle || null);
      }
    } else {
      var pcForm = registerVm.$refs && registerVm.$refs.reigsterForm ? registerVm.$refs.reigsterForm.$el : document.querySelector("form");
      var pcItems = pcForm ? pcForm.querySelectorAll(".el-form-item") : [];
      if (pcForm) {
        pcForm.insertBefore(box, pcItems.length > 1 ? pcItems[1] : null);
      }
    }
  }

  function replaceBrand(root) {
    replaceText(root);
    replaceAttributes(root);
    hideUnsupportedLanguages(root);
    customizeMerchantApplication();
    customizeEmailRegistration();
    if (brandPattern.test(document.title) || mallPattern.test(document.title)) {
      brandPattern.lastIndex = 0;
      mallPattern.lastIndex = 0;
      document.title = document.title
        .replace(mallPattern, mallReplacement)
        .replace(brandPattern, replacement);
    }
    brandPattern.lastIndex = 0;
    mallPattern.lastIndex = 0;
  }

  function start() {
    setFavicon();
    replaceBrand(document.documentElement);
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "characterData") {
          replaceBrand(mutation.target.parentElement || document.documentElement);
          return;
        }
        Array.prototype.forEach.call(mutation.addedNodes, function (node) {
          if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            replaceBrand(node.parentElement);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            replaceBrand(node);
          }
        });
      });
    }).observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
