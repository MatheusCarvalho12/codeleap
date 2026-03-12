import { AnimatePresence, motion } from 'framer-motion'
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[660px] rounded-2xl bg-white p-6 shadow-modal"
        >
          <p className="text-[22px] font-bold text-black">Are you sure you want to delete this item?</p>
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" onClick={onCancel} disabled={loading} className="min-h-0 rounded-lg px-7 py-2">
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} disabled={loading} className="min-h-0 rounded-lg px-7 py-2">
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
)
