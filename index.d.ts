import Vue from 'vue'
import { SnapFunction, Interactable, InteractStatic } from 'interactjs'

export default class VAnnotator extends Vue {
  readonly $refs: {
    readonly svg: SVGElement
    readonly bgSvg: SVGForeignObjectElement
    readonly bg: HTMLDivElement
    readonly annotations: SVGGElement
  }

  readonly $props: {
    readonly width: number | string
    readonly height: number | string
    readonly drawing: boolean
    readonly noInteract: boolean
    readonly noSelect: boolean

    /** @see manipulate.js */
    readonly inertia: boolean
    readonly grid: number[] | number
    readonly minSize: number[] | number
    readonly multipleSelect: boolean // also in select.js

    /** @see delete.js */
    readonly delete: boolean
  }

  readonly $data: {
    w: number
    h: number
    background: SVGForeignObjectElement
    annotations: SVGGElement

    /** @see select.js */
    selectables: Interactable

    /** @see manipulate.js */
    interactables: InteractStatic[]

    /** @see drawing.js */
    drawingable?: Interactable
  }

  /** @see select.js */
  makeSelectable(node: SVGElement): Interactable
  enableSelection(enabled: boolean): void

  /** @see manipulate.js */
  readonly gridTarget?: SnapFunction
  readonly minWidth: number
  readonly minHeight: number
  makeInteractable(node: Element, fixDrawingMode: boolean): InteractStatic
  enableInteraction(enabled: boolean): void

  /** @see drawing.js */
  enableDrawing(enabled: boolean): void

  /** @see delete.js */
  triggerDelete(): void
}
