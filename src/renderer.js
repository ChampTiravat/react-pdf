'use strict';

import ReactFiberReconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import { createInstance } from './elements';

const objectsEqual = (a, b) => {
  const oldPropsKeys = Object.keys(a);
  const newPropsKeys = Object.keys(b);

  if (oldPropsKeys.length !== newPropsKeys.length) {
    return false;
  }

  for (let i = 0; i < oldPropsKeys.length; i++) {
    const propName = oldPropsKeys[i];

    if (propName === 'render') {
      if (!a[propName] !== !b[propName]) {
        return false;
      }
      continue;
    }

    if (propName !== 'children' && a[propName] !== b[propName]) {
      if (
        typeof a[propName] === 'object' &&
        typeof b[propName] === 'object' &&
        objectsEqual(a[propName], b[propName])
      ) {
        continue;
      }

      return false;
    }
  }

  return true;
};

// If the Link has a strign child or render prop, substitute the instance by a Text,
// that will ultimately render the inline Link via the textkit PDF renderer.
const shouldReplaceLink = (type, props) =>
  type === 'LINK' &&
  (typeof props.children === 'string' ||
    Array.isArray(props.children) ||
    props.render);

const PDFRenderer = ReactFiberReconciler({
  supportsMutation: true,
  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  createInstance(type, props, internalInstanceHandle) {
    const instanceType = shouldReplaceLink(type, props) ? 'TEXT' : type;
    return createInstance(
      { type: instanceType, props },
      internalInstanceHandle,
    );
  },

  createTextInstance(text, rootContainerInstance) {
    return createInstance(
      { type: 'TEXT_INSTANCE', props: text },
      rootContainerInstance,
    );
  },

  finalizeInitialChildren(element, type, props) {
    return false;
  },

  getPublicInstance(instance) {
    return instance;
  },

  prepareForCommit() {
    // Noop
  },

  prepareUpdate(element, type, oldProps, newProps) {
    return !objectsEqual(oldProps, newProps);
  },

  resetAfterCommit() {
    // Noop
  },

  resetTextContent(element) {
    // Noop
  },

  getRootHostContext() {
    return emptyObject;
  },

  getChildHostContext() {
    return emptyObject;
  },

  shouldSetTextContent(type, props) {
    return false;
  },

  now: Date.now,

  useSyncScheduling: true,

  appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  appendChildToContainer(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  insertBefore(parentInstance, child, beforeChild) {
    parentInstance.appendChildBefore(child, beforeChild);
  },

  removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },

  removeChildFromContainer(parentInstance, child) {
    parentInstance.removeChild(child);
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.update(newText);
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    instance.update(newProps);
  },
});

export default PDFRenderer;
