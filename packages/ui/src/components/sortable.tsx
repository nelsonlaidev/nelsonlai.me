/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/ui/sortable.tsx
 *
 * Modified by: Nelson Lai
 */
'use client'

import {
  type Announcements,
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  type DndContextProps,
  type DragEndEvent,
  type DraggableSyntheticListeners,
  DragOverlay,
  type DropAnimation,
  KeyboardSensor,
  MouseSensor,
  type ScreenReaderInstructions,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToHorizontalAxis, restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  type SortableContextProps,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@repo/utils'
import { createContext, use, useCallback, useEffect, useId, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { composeEventHandlers, useComposedRefs } from '../lib/composition'

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
    collisionDetection: closestCenter
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
    collisionDetection: closestCenter
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: undefined,
    collisionDetection: closestCorners
  }
}

const ROOT_NAME = 'Sortable'
const CONTENT_NAME = 'SortableContent'
const ITEM_NAME = 'SortableItem'
const ITEM_HANDLE_NAME = 'SortableItemHandle'
const OVERLAY_NAME = 'SortableOverlay'

const SORTABLE_ERRORS = {
  [ROOT_NAME]: `\`${ROOT_NAME}\` components must be within \`${ROOT_NAME}\``,
  [CONTENT_NAME]: `\`${CONTENT_NAME}\` must be within \`${ROOT_NAME}\``,
  [ITEM_NAME]: `\`${ITEM_NAME}\` must be within \`${CONTENT_NAME}\``,
  [ITEM_HANDLE_NAME]: `\`${ITEM_HANDLE_NAME}\` must be within \`${ITEM_NAME}\``,
  [OVERLAY_NAME]: `\`${OVERLAY_NAME}\` must be within \`${ROOT_NAME}\``
} as const

type SortableRootContextValue<T> = {
  id: string
  items: UniqueIdentifier[]
  modifiers: DndContextProps['modifiers']
  strategy: SortableContextProps['strategy']
  activeId: UniqueIdentifier | null
  setActiveId: (id: UniqueIdentifier | null) => void
  getItemValue: (item: T) => UniqueIdentifier
  flatCursor: boolean
}

const SortableRootContext = createContext<SortableRootContextValue<unknown> | null>(null)
SortableRootContext.displayName = ROOT_NAME

const useSortableContext = (name: keyof typeof SORTABLE_ERRORS) => {
  const context = use(SortableRootContext)
  if (!context) {
    throw new Error(SORTABLE_ERRORS[name])
  }
  return context
}

type GetItemValue<T> = {
  getItemValue: (item: T) => UniqueIdentifier
}

type SortableProps<T> = DndContextProps & {
  value: T[]
  onValueChange?: (items: T[]) => void
  onMove?: (event: DragEndEvent & { activeIndex: number; overIndex: number }) => void
  strategy?: SortableContextProps['strategy']
  orientation?: 'vertical' | 'horizontal' | 'mixed'
  flatCursor?: boolean
} & (T extends object ? GetItemValue<T> : Partial<GetItemValue<T>>)

const Sortable = <T,>(props: SortableProps<T>) => {
  const {
    value,
    onValueChange,
    collisionDetection,
    modifiers,
    strategy,
    onMove,
    orientation = 'vertical',
    flatCursor = false,
    getItemValue: getItemValueProp,
    accessibility,
    ...sortableProps
  } = props
  const id = useId()
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const config = useMemo(() => orientationConfig[orientation], [orientation])

  const getItemValue = useCallback(
    (item: T): UniqueIdentifier => getItemValueProp?.(item) ?? (item as UniqueIdentifier),
    [getItemValueProp]
  )

  const items = useMemo(() => {
    return value.map((item) => getItemValue(item))
  }, [value, getItemValue])

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        const activeIndex = value.findIndex((item) => getItemValue(item) === active.id)
        const overIndex = value.findIndex((item) => getItemValue(item) === over.id)

        if (onMove) {
          onMove({ ...event, activeIndex, overIndex })
        } else {
          onValueChange?.(arrayMove(value, activeIndex, overIndex))
        }
      }
      setActiveId(null)
    },
    [value, onValueChange, onMove, getItemValue]
  )

  const announcements: Announcements = useMemo(
    () => ({
      onDragStart({ active }) {
        const idx = (active.data.current?.sortable.index ?? 0) as number
        const activeValue = active.id.toString()
        return `Grabbed sortable item "${activeValue}". Current position is ${idx + 1} of ${value.length}. Use arrow keys to move, space to drop.`
      },
      onDragOver({ active, over }) {
        if (over) {
          const overIndex = (over.data.current?.sortable.index ?? 0) as number
          const activeIndex = (active.data.current?.sortable.index ?? 0) as number
          const moveDirection = overIndex > activeIndex ? 'down' : 'up'
          const activeValue = active.id.toString()
          return `Sortable item "${activeValue}" moved ${moveDirection} to position ${overIndex + 1} of ${value.length}.`
        }
        return 'Sortable item is no longer over a droppable area. Press escape to cancel.'
      },
      onDragEnd({ active, over }) {
        const activeValue = active.id.toString()
        if (over) {
          const overIndex = (over.data.current?.sortable.index ?? 0) as number
          return `Sortable item "${activeValue}" dropped at position ${overIndex + 1} of ${value.length}.`
        }
        return `Sortable item "${activeValue}" dropped. No changes were made.`
      },
      onDragCancel({ active }) {
        const activeIndex = (active.data.current?.sortable.index ?? 0) as number
        const activeValue = active.id.toString()
        return `Sorting cancelled. Sortable item "${activeValue}" returned to position ${activeIndex + 1} of ${value.length}.`
      },
      onDragMove({ active, over }) {
        if (over) {
          const overIndex = (over.data.current?.sortable.index ?? 0) as number
          const activeIndex = (active.data.current?.sortable.index ?? 0) as number
          const moveDirection = overIndex > activeIndex ? 'down' : 'up'
          const activeValue = active.id.toString()
          return `Sortable item "${activeValue}" is moving ${moveDirection} to position ${overIndex + 1} of ${value.length}.`
        }
        return 'Sortable item is no longer over a droppable area. Press escape to cancel.'
      }
    }),
    [value]
  )

  const screenReaderInstructions: ScreenReaderInstructions = useMemo(() => {
    let moveKeys: string
    if (orientation === 'vertical') {
      moveKeys = 'up and down'
    } else if (orientation === 'horizontal') {
      moveKeys = 'left and right'
    } else {
      moveKeys = 'arrow'
    }

    return {
      draggable: `
        To pick up a sortable item, press space or enter.
        While dragging, use the ${moveKeys} keys to move the item.
        Press space or enter again to drop the item in its new position, or press escape to cancel.
      `
    }
  }, [orientation])

  const contextValue = useMemo(
    () => ({
      id,
      items,
      modifiers: modifiers ?? config.modifiers,
      strategy: strategy ?? config.strategy,
      activeId,
      setActiveId,
      getItemValue,
      flatCursor
    }),
    [id, items, modifiers, strategy, config.modifiers, config.strategy, activeId, getItemValue, flatCursor]
  )

  return (
    <SortableRootContext value={contextValue as SortableRootContextValue<unknown>}>
      <DndContext
        collisionDetection={collisionDetection ?? config.collisionDetection}
        modifiers={modifiers ?? config.modifiers}
        sensors={sensors}
        {...sortableProps}
        id={id}
        onDragStart={composeEventHandlers(sortableProps.onDragStart, ({ active }) => {
          setActiveId(active.id)
        })}
        onDragEnd={composeEventHandlers(sortableProps.onDragEnd, onDragEnd)}
        onDragCancel={composeEventHandlers(sortableProps.onDragCancel, () => {
          setActiveId(null)
        })}
        accessibility={{
          announcements,
          screenReaderInstructions,
          ...accessibility
        }}
      />
    </SortableRootContext>
  )
}

const SortableContentContext = createContext<boolean>(false)
SortableContentContext.displayName = CONTENT_NAME

type SortableContentProps = {
  strategy?: SortableContextProps['strategy']
  children: React.ReactNode
  asChild?: boolean
  withoutSlot?: boolean
} & React.ComponentProps<'div'>

const SortableContent = (props: SortableContentProps) => {
  const { strategy: strategyProp, asChild, withoutSlot, children, ref, ...contentProps } = props
  const context = useSortableContext(CONTENT_NAME)

  const ContentPrimitive = asChild ? Slot : 'div'

  return (
    <SortableContentContext value={true}>
      <SortableContext items={context.items} strategy={strategyProp ?? context.strategy}>
        {withoutSlot ? (
          children
        ) : (
          <ContentPrimitive data-slot='sortable-content' {...contentProps} ref={ref}>
            {children}
          </ContentPrimitive>
        )}
      </SortableContext>
    </SortableContentContext>
  )
}

type SortableItemContextValue = {
  id: string
  attributes: React.HTMLAttributes<HTMLElement>
  listeners: DraggableSyntheticListeners | undefined
  setActivatorNodeRef: (node: HTMLElement | null) => void
  isDragging?: boolean
  disabled?: boolean
}

const SortableItemContext = createContext<SortableItemContextValue | null>(null)
SortableItemContext.displayName = ITEM_NAME

type SortableItemProps = {
  value: UniqueIdentifier
  asHandle?: boolean
  asChild?: boolean
  disabled?: boolean
} & React.ComponentProps<'div'>

const SortableItem = (props: SortableItemProps) => {
  const { value, style, asHandle, asChild, disabled, className, ref, ...itemProps } = props
  const inSortableContent = use(SortableContentContext)
  const inSortableOverlay = use(SortableOverlayContext)

  if (!inSortableContent && !inSortableOverlay) {
    throw new Error(SORTABLE_ERRORS[ITEM_NAME])
  }

  if (value === '') {
    throw new Error(`\`${ITEM_NAME}\` value cannot be an empty string`)
  }

  const context = useSortableContext(ITEM_NAME)
  const id = useId()
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: value,
    disabled
  })

  const composedRef = useComposedRefs(ref, (node) => {
    if (disabled) return
    setNodeRef(node)
    if (asHandle) setActivatorNodeRef(node)
  })

  const composedStyle = useMemo<React.CSSProperties>(() => {
    return {
      transform: CSS.Translate.toString(transform),
      transition,
      ...style
    }
  }, [transform, transition, style])

  const itemContext = useMemo<SortableItemContextValue>(
    () => ({
      id,
      attributes,
      listeners,
      setActivatorNodeRef,
      isDragging,
      disabled
    }),
    [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled]
  )

  const ItemPrimitive = asChild ? Slot : 'div'

  return (
    <SortableItemContext value={itemContext}>
      <ItemPrimitive
        id={id}
        data-dragging={isDragging ? '' : undefined}
        data-slot='sortable-item'
        {...itemProps}
        {...(asHandle ? attributes : {})}
        {...(asHandle ? listeners : {})}
        tabIndex={disabled ? undefined : 0}
        ref={composedRef}
        style={composedStyle}
        className={cn(
          'focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden',
          {
            'touch-none select-none': asHandle,
            'cursor-default': context.flatCursor,
            'data-dragging:cursor-grabbing': !context.flatCursor,
            'cursor-grab': !isDragging && asHandle && !context.flatCursor,
            'opacity-50': isDragging,
            'pointer-events-none opacity-50': disabled
          },
          className
        )}
      />
    </SortableItemContext>
  )
}

type SortableItemHandleProps = {
  asChild?: boolean
} & React.ComponentProps<'button'>

const SortableItemHandle = (props: SortableItemHandleProps) => {
  const { asChild, disabled, className, ref, ...itemHandleProps } = props
  const itemContext = use(SortableItemContext)
  if (!itemContext) {
    throw new Error(SORTABLE_ERRORS[ITEM_HANDLE_NAME])
  }
  const context = useSortableContext(ITEM_HANDLE_NAME)

  const isDisabled = disabled ?? itemContext.disabled

  const composedRef = useComposedRefs(ref, (node) => {
    if (!isDisabled) return
    itemContext.setActivatorNodeRef(node)
  })

  const HandlePrimitive = asChild ? Slot : 'button'

  return (
    <HandlePrimitive
      type='button'
      aria-controls={itemContext.id}
      data-dragging={itemContext.isDragging ? '' : undefined}
      data-slot='sortable-item-handle'
      {...itemHandleProps}
      {...itemContext.attributes}
      {...itemContext.listeners}
      ref={composedRef}
      className={cn(
        'select-none',
        'disabled:pointer-events-none disabled:opacity-50',
        context.flatCursor ? 'cursor-default' : 'cursor-grab data-dragging:cursor-grabbing',
        className
      )}
      disabled={isDisabled}
    />
  )
}

const SortableOverlayContext = createContext(false)
SortableOverlayContext.displayName = OVERLAY_NAME

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4'
      }
    }
  })
}

type SortableOverlayProps = {
  container?: Element | DocumentFragment | null
  children?: ((params: { value: UniqueIdentifier }) => React.ReactNode) | React.ReactNode
} & Omit<React.ComponentProps<typeof DragOverlay>, 'children'>

const SortableOverlay = (props: SortableOverlayProps) => {
  const { container: containerProp, children, ...overlayProps } = props
  const context = useSortableContext(OVERLAY_NAME)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const container = containerProp ?? (mounted ? globalThis.document.body : null)

  if (!container) return null

  let overlayContent: React.ReactNode = null
  if (context.activeId) {
    overlayContent = typeof children === 'function' ? children({ value: context.activeId }) : children
  }

  return createPortal(
    <DragOverlay
      dropAnimation={dropAnimation}
      modifiers={context.modifiers}
      className={cn(!context.flatCursor && 'cursor-grabbing')}
      {...overlayProps}
    >
      <SortableOverlayContext value={true}>{overlayContent}</SortableOverlayContext>
    </DragOverlay>,
    container
  )
}

export { Sortable, SortableContent, SortableItem, SortableItemHandle, SortableOverlay }
