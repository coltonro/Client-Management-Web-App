

const DeleteModal = ({ handleRemove, handleClose, station }) => {
  return (
    <>
         Previous survey reports will not be altered by this aciton.
            <div className='modalButtons'>
                <button
                    onClick={handleClose}
                >
                    Keep
                </button>
                <button
                    id={station}
                    onClick={(e) => handleRemove(e)}
                >Remove</button>
            </div>
        </>
  )
}

export default DeleteModal