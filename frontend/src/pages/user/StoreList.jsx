import React, { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner'
import RatingStars from '../../components/RatingStars'
import Modal from '../../components/Modal'
import { getStores as fetchStores } from '../../services/storeService'
import { submitRating, updateRating } from '../../services/ratingService'

const StoreList = () => {
  const [stores, setStores]     = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const [limit]                 = useState(9)
  const [search, setSearch]     = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Rating modal state
  const [ratingModal, setRatingModal]   = useState(null)   // { store, existingRating }
  const [ratingValue, setRatingValue]   = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)

  const totalPages = Math.ceil(total / limit)

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, limit }
    if (search) params.name = search
    fetchStores(params)
      .then(res => {
        setStores(res.data.data.stores)
        setTotal(res.data.data.total)
      })
      .catch(() => toast.error('Failed to load stores.'))
      .finally(() => setLoading(false))
  }, [page, limit, search])

  useEffect(() => { load() }, [load])

  const applySearch = () => { setSearch(searchInput); setPage(1) }
  const clearSearch = () => { setSearch(''); setSearchInput(''); setPage(1) }

  const openRateModal = (store) => {
    setRatingModal({ store, existingRating: store.user_rating })
    setRatingValue(store.user_rating || 0)
  }

  const handleRate = async () => {
    if (!ratingValue) { toast.error('Please select a rating (1–5)'); return }
    setRatingLoading(true)
    try {
      if (ratingModal.existingRating) {
        await updateRating(ratingModal.store.rating_id, { rating: ratingValue })
        toast.success('Rating updated!')
      } else {
        await submitRating({ store_id: ratingModal.store.id, rating: ratingValue })
        toast.success('Rating submitted!')
      }
      setRatingModal(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating.')
    } finally {
      setRatingLoading(false)
    }
  }

  return (
    <DashboardLayout title="Browse Stores">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>🏪 Browse Stores</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Discover and rate stores on the platform</p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, maxWidth: 480 }}>
        <input
          type="text" value={searchInput} placeholder="Search stores by name..."
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && applySearch()}
          style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none' }}
        />
        <button onClick={applySearch} style={{ padding: '10px 18px', background: '#6C63FF', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Search
        </button>
        {search && (
          <button onClick={clearSearch} style={{ padding: '10px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={40} /></div>
      ) : stores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏪</div>
          <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 8 }}>No stores found</div>
          {search && <button onClick={clearSearch} style={{ color: '#8B85FF', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Clear search</button>}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18, marginBottom: 24 }}>
            {stores.map(store => (
              <div key={store.id} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: 22, transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
              >
                {/* Store icon */}
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(108,99,255,0.15))', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>
                  🏪
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{store.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>📍 {store.address}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>✉ {store.email}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <RatingStars value={parseFloat(store.average_rating) || 0} size={17} />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                      {store.rating_count || 0} rating{store.rating_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {store.user_rating && (
                    <div style={{ background: 'rgba(72,187,120,0.12)', border: '1px solid rgba(72,187,120,0.25)', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#68D391' }}>
                      ✓ You rated: {store.user_rating}★
                    </div>
                  )}
                </div>

                <button onClick={() => openRateModal(store)}
                  style={{
                    padding: '9px 0', marginTop: 'auto',
                    background: store.user_rating ? 'rgba(108,99,255,0.15)' : 'linear-gradient(135deg, #6C63FF, #5048E5)',
                    border: store.user_rating ? '1px solid rgba(108,99,255,0.35)' : 'none',
                    borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!store.user_rating) e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {store.user_rating ? '✏ Update Rating' : '⭐ Rate This Store'}
                </button>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} />
        </>
      )}

      {/* Rating Modal */}
      <Modal
        isOpen={!!ratingModal}
        onClose={() => setRatingModal(null)}
        title={ratingModal?.existingRating ? '✏ Update Your Rating' : '⭐ Rate This Store'}
        footer={
          <>
            <button onClick={() => setRatingModal(null)} style={{ padding: '9px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
              Cancel
            </button>
            <button onClick={handleRate} disabled={ratingLoading || !ratingValue}
              style={{ padding: '9px 22px', background: !ratingValue || ratingLoading ? 'rgba(108,99,255,0.4)' : 'linear-gradient(135deg, #6C63FF, #5048E5)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: ratingLoading || !ratingValue ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              {ratingLoading ? <><Spinner size={14} color="#fff" />Submitting...</> : (ratingModal?.existingRating ? 'Update' : 'Submit')}
            </button>
          </>
        }
      >
        {ratingModal && (
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{ratingModal.store.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>
              {ratingModal.existingRating ? `Your current rating: ${ratingModal.existingRating}★` : 'Select your rating below:'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} onClick={() => setRatingValue(v)}
                  style={{
                    width: 52, height: 52, borderRadius: 12, border: 'none',
                    background: v <= ratingValue ? 'linear-gradient(135deg, #FFD060, #FFB020)' : 'rgba(255,255,255,0.06)',
                    color: v <= ratingValue ? '#1a1a00' : 'rgba(255,255,255,0.4)',
                    fontSize: 22, cursor: 'pointer', fontWeight: 700,
                    transition: 'all 0.15s', transform: v <= ratingValue ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: v <= ratingValue ? '0 4px 14px rgba(255,208,96,0.4)' : 'none',
                  }}>
                  ★
                </button>
              ))}
            </div>
            {ratingValue > 0 && (
              <p style={{ textAlign: 'center', fontSize: 13, color: '#FFD060', fontWeight: 600 }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][ratingValue]} · {ratingValue} star{ratingValue > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}

export default StoreList
