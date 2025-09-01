import { TreeView as TreeViewPrimitive } from '@ark-ui/react/tree-view'
import { cn } from '@repo/utils'
import { ChevronRightIcon, FileIcon, FolderIcon } from 'lucide-react'

type Node = {
  id: string
  name: string
  children?: Node[]
}

type TreeViewProps = {
  label?: string
} & React.ComponentProps<typeof TreeViewPrimitive.Root<Node>>

const TreeView = (props: TreeViewProps) => {
  const { collection, className, label = 'Tree View', ...rest } = props

  return (
    <TreeViewPrimitive.Root
      data-slot='tree-view'
      collection={collection}
      className={cn('rounded-md border bg-card p-2', className)}
      {...rest}
    >
      <TreeViewPrimitive.Label className='sr-only'>{label}</TreeViewPrimitive.Label>
      <TreeViewPrimitive.Tree aria-label={label}>
        {collection.rootNode.children?.map((node, index) => (
          <TreeViewNode key={node.id} node={node} indexPath={[index]} />
        ))}
      </TreeViewPrimitive.Tree>
    </TreeViewPrimitive.Root>
  )
}

type TreeViewNodeProps = TreeViewPrimitive.NodeProviderProps<Node>

const TreeViewNode = (props: TreeViewNodeProps) => {
  const { node, indexPath } = props

  return (
    <TreeViewPrimitive.NodeProvider data-slot='tree-view-node' key={node.id} node={node} indexPath={indexPath}>
      {node.children ? (
        <TreeViewPrimitive.Branch>
          <TreeViewPrimitive.BranchControl className='flex items-center justify-between rounded-sm px-2 py-1.5 pl-[calc(var(--depth)*8px)] text-sm hover:bg-accent hover:text-accent-foreground'>
            <TreeViewPrimitive.BranchText className='flex items-center gap-2'>
              <FolderIcon className='size-4' /> {node.name}
            </TreeViewPrimitive.BranchText>
            <TreeViewPrimitive.BranchIndicator className='[&[data-state=open]>svg]:rotate-90'>
              <ChevronRightIcon className='size-4 transition-transform duration-200' />
            </TreeViewPrimitive.BranchIndicator>
          </TreeViewPrimitive.BranchControl>
          <TreeViewPrimitive.BranchContent className='overflow-hidden data-[state=closed]:animate-tree-view-content-up data-[state=open]:animate-tree-view-content-down'>
            <TreeViewPrimitive.BranchIndentGuide />
            {node.children.map((child, index) => (
              <TreeViewNode key={child.id} node={child} indexPath={[...indexPath, index]} />
            ))}
          </TreeViewPrimitive.BranchContent>
        </TreeViewPrimitive.Branch>
      ) : (
        <TreeViewPrimitive.Item className='relative rounded-sm px-2 py-1.5 pl-[calc(var(--depth)*8px)] text-sm hover:bg-accent hover:text-accent-foreground data-selected:bg-accent'>
          <TreeViewPrimitive.ItemText className='flex items-center gap-2'>
            <FileIcon className='size-4' />
            {node.name}
          </TreeViewPrimitive.ItemText>
        </TreeViewPrimitive.Item>
      )}
    </TreeViewPrimitive.NodeProvider>
  )
}

export { type Node, TreeView, TreeViewNode }
export { createTreeCollection } from '@ark-ui/react/tree-view'
