import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'

interface DeleteModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  loading?: boolean
}

export const DeleteModal = ({ open, onCancel, onConfirm, loading }: DeleteModalProps) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-modal flex flex-col gap-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
              <Trash2 size={18} className="text-danger" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-base">Delete post?</p>
              <p className="text-muted text-sm mt-1">Are you sure you want to delete this item? This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} disabled={loading}>
              {loading ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
)
