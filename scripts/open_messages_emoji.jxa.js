#!/usr/bin/env osascript -l JavaScript

let _AXError;

const $attr = Ref();
const $windows = Ref();
const $children = Ref();

const kAXParentAttribute = 'AXParent';
const kAXChildrenAttribute = 'AXChildren';
const kAXIdentifierAttribute = 'AXIdentifier';
const kAXDescriptionAttribute = 'AXDescription';
const kAXFocusedUIElementAttribute = 'AXFocusedUIElement';

const kAXPressAction = 'AXPress';

function run(_) {
  // Get the process identifier for the Messages application.
  const pid = $.NSRunningApplication.runningApplicationsWithBundleIdentifier(
    'com.apple.MobileSMS',
  ).firstObject.processIdentifier;

  // Create the Messages AXApplication element.
  const app = $.AXUIElementCreateApplication(pid);

  // Get focused UI element, assuming such element is message body field.
  const $focused = Ref();
  _AXError = $.AXUIElementCopyAttributeValue(
    app,
    kAXFocusedUIElementAttribute,
    $focused,
  );

  if (_AXError != 0) {
    return 1;
  }

  // By identifier, check that focused UI element is message body field.
  _AXError = $.AXUIElementCopyAttributeValue(
    $focused[0],
    kAXIdentifierAttribute,
    $attr,
  );

  if (_AXError != 0 || $attr[0].js != 'messageBodyField') {
    return 1;
  }

  // Get the parent group owning the message body field and emoji button.
  $.AXUIElementCopyAttributeValue($focused[0], kAXParentAttribute, $attr);

  // Get the children of the parent group.
  $.AXUIElementCopyAttributeValue($attr[0], kAXChildrenAttribute, $children);

  // Find the emoji button.
  const emojiPicker = $children[0].js.find((child) => {
    $.AXUIElementCopyAttributeValue(child, kAXDescriptionAttribute, $attr);
    return $attr[0].js == 'Emoji picker';
  });

  // Press the emoji button.
  $.AXUIElementPerformAction(emojiPicker, kAXPressAction);

  return 0;
}

// prettier-ignore
(() => {
ObjC.import('Cocoa'); // yes, it's necessary -- stop telling me it isn't

ObjC.bindFunction('AXUIElementPerformAction', ['int', ['id', 'id']]);
ObjC.bindFunction('AXValueCreate', ['id', ['unsigned int', 'void*']]);
ObjC.bindFunction('AXUIElementCreateApplication', ['id', ['unsigned int']]);
ObjC.bindFunction('AXUIElementSetAttributeValue', ['int', ['id', 'id', 'id']]);
ObjC.bindFunction('AXUIElementCopyAttributeValue',['int', ['id', 'id', 'id*']]);
})();
