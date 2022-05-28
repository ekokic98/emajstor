import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { addDeal, getAllJobs } from 'api/job/job'
import { getAllGallery } from 'api/job/job'
import Paper from '@material-ui/core/Paper'
import SearchBar from 'material-ui-search-bar'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Modal from '@material-ui/core/Modal'
import Container from '@mui/material/Container'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Alert from '@mui/material/Alert'
import { makeStyles } from '@material-ui/core/styles'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import CssBaseline from '@mui/material/CssBaseline'
import { getUser } from '../../utilities/localStorage'
import { addReview } from 'api/review/review'

function getBusinessName(params) {
  return `${params.row.business.name || ''}`
}

function getPriceType(params) {
  if (params.row.priceType === 'PER_HOUR') return 'Per hour'
  else if (params.row.priceType === 'PER_DAY') return 'Per day'
  return `${params.row.business.name || ''}`
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    paddingBottom: '20px',
  },
  grid: {
    height: '100vh',
    marginTop: '10px',
  },
  paperLeft: {
    height: '100vh',
  },
  paperTop: {
    height: '20%',
  },
  paperMain: {
    height: '100vh',
  },
  paperRight: {},
  paperBottom: { height: '20%' },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.primary,
    background: theme.palette.grey,
  },
}))

const inputStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '2px solid white',
}

const labels = {
  1: 'Useless+',
  2: 'Poor+',
  3: 'Ok+',
  4: 'Good+',
  5: 'Excellent+',
}

export default function UserPage() {
  const columns = [
    {
      field: 'name',
      headerName: 'Bussines',
      width: 150,
      sortable: true,
      valueGetter: getBusinessName,
    },
    { field: 'price', width: 150, headerName: 'Price', sortable: true },
    {
      field: 'priceType',
      headerName: 'Price Type',
      width: 150,

      sortable: true,
      valueGetter: getPriceType,
    },
    { field: 'userName', headerName: 'Worker', width: 150, sortable: true },
    {
      field: 'gallery',
      headerName: 'Gallery',
      renderCell: (params) => (
        <Button
          spacing={1}
          variant='contained'
          onClick={() => handleOpen(params.row)}
        >
          View gallery
        </Button>
      ),
      sortable: false,
      width: 200,
      valueGetter: (params) =>
        `${params.row.price || ''} ${params.row.userName || ''}`,
    },
    {
      field: 'review',
      headerName: 'Review',
      renderCell: (params) => (
        <Button
          spacing={1}
          variant='contained'
          onClick={() => handleOpenReview(params.row)}
        >
          Make review
        </Button>
      ),

      sortable: false,
      width: 200,
    },
    {
      field: 'job',
      headerName: 'Take a job',
      renderCell: (params) => (
        <Button
          spacing={1}
          variant='contained'
          onClick={() => handleTakeJob(params.row)}
        >
          Take job
        </Button>
      ),

      sortable: false,
      width: 200,
    },
  ]
  const [rows, setRows] = useState([])
  const [jobs, setJobs] = useState([])
  const [searched, setSearched] = useState('')
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState([])
  const [currentImg, setCurrentImg] = useState()
  const [position, setPosition] = useState(0)
  const [openReview, setOpenReview] = useState(false)
  const [value, setValue] = useState(2)
  const classes = useStyles()
  const [selectedRow, setSelectedRow] = useState()
  const [textReview, setTextReview] = useState('')
  const user = getUser()

  const handleOpenReview = (row) => {
    setSelectedRow(row)
    setOpenReview(true)
  }
  const handleCloseReview = () => setOpenReview(false)

  const handleSubmitReview = async () => {
    const values = {
      numStars: value,
      comment: textReview,
      user: user.id,
      worker: selectedRow.user,
    }
    await addReview(values)
    handleCloseReview()
  }

  const handleTakeJob = async (row) => {
    const values = {
      user: user.id,
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      number: user.number,
      job: row,
      finished: false,
    }
    await addDeal(values)
  }

  const handlePrevious = () => {
    let value = position - 1
    if (value < 0) {
      value = images.length - 1
    }
    setCurrentImg(images[value]?.fileEntity?.data)
    setPosition(value)
  }

  const handleNext = () => {
    let value = position + 1

    if (value > images.length - 1) {
      value = 0
    }

    setCurrentImg(images[value]?.fileEntity?.data)
    setPosition(value)
  }

  async function fetchData(jobId) {
    try {
      console.log(jobId)
      const response = await getAllGallery()
      const imgs = response.filter((data) => data.jobId === jobId)
      setImages(imgs)

      setCurrentImg(imgs[position]?.fileEntity?.data)
      setOpen(true)
    } catch (e) {
      console.error(e)
    }
  }

  const handleOpen = (row) => {
    fetchData(row.id)
  }
  const handleClose = () => setOpen(false)

  const handleChangeReview = (event) => {
    setTextReview(event.target.value)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllJobs()
        setJobs(response)
        setRows(response)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  const requestSearch = (searchedVal) => {
    const filteredRows = jobs.filter((row) => {
      return row.business.name.toLowerCase().includes(searchedVal.toLowerCase())
    })
    setRows(filteredRows)
  }

  const cancelSearch = () => {
    setSearched('')
    requestSearch(searched)
  }

  return (
    <div className={classes.root} style={{ paddingBottom: '10px' }}>
      <Grid container spacing={1} className={classes.grid}>
        <Grid item container xs={12} spacing={1}>
          <Grid item xs={2}>
            <Paper className={`${classes.paperLeft} ${classes.paper}`}>
              xs=12 sm=6
            </Paper>
          </Grid>
          <Grid item xs={10}>
            <Paper className={`${classes.paperMain} ${classes.paper}`}>
              <SearchBar
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
                onCancelSearch={() => cancelSearch()}
              />
              <div
                style={{
                  margin: '0 auto',
                  height: '95%',
                  width: '100%',
                  fontSize: '20px',
                  paddingBottom: '4px',
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[15]}
                  disableSelectionOnClick
                />
              </div>
              <Modal
                style={{
                  marginTop: '150px',
                }}
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                disableEscapeKeyDown
                disableEnforceFocus
              >
                <Container component='main' maxWidth='lg'>
                  <Box
                    sx={{
                      borderRadius: '5px',
                      backgroundColor: '#FFFAFA',
                      opacity: 0.9,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '25px',
                    }}
                  >
                    <Grid item xs={12}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {images.length === 0 ? (
                          <Alert severity='error'>
                            There is no images for this job!
                          </Alert>
                        ) : (
                          <Box
                            component='img'
                            style={{
                              maxWidth: '90%',
                              height: '600px',
                              borderWidth: 1,
                              borderColor: 'red',
                            }}
                            src={`data:image/jpeg;base64,${currentImg}`}
                          />
                        )}
                      </div>
                    </Grid>

                    <ButtonGroup
                      style={{
                        width: '90%',
                        displey: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      {images.length !== 0 && (
                        <ArrowBackIosNewIcon onClick={handlePrevious} />
                      )}
                      <Button
                        onClick={handleClose}
                        variant='contained'
                        style={{
                          backgroundColor: 'red',
                          width: '20%',
                          color: '#ffff',
                          borderRadius: '10',
                        }}
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Close
                      </Button>
                      {images.length !== 0 && (
                        <ArrowForwardIosIcon onClick={handleNext} />
                      )}
                    </ButtonGroup>
                  </Box>
                </Container>
              </Modal>

              <Modal
                style={{
                  marginTop: '150px',
                }}
                open={openReview}
                onClose={handleCloseReview}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                disableEscapeKeyDown
                disableEnforceFocus
              >
                <div style={inputStyle}>
                  <Container component='main' maxWidth='sm'>
                    <CssBaseline />
                    <Box
                      sx={{
                        borderRadius: '5px',
                        backgroundColor: '#FFFAFA',
                        opacity: 0.9,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '20px',
                      }}
                    >
                      <Box component='form' noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}></Grid>
                          <div
                            style={{
                              marginLeft: '30%',
                              width: '100%',
                              borderRadius: '10',
                            }}
                          >
                            <h4>Rate your craftsman</h4>
                            <Rating
                              style={{
                                marginLeft: '5%',
                                borderRadius: '10',
                              }}
                              name='hover-feedback'
                              value={value}
                              precision={1}
                              onChange={(event, newValue) => {
                                setValue(newValue)
                              }}
                            />
                            {value !== null && (
                              <Box ml={2}>{labels[value]}</Box>
                            )}
                          </div>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              label='Review'
                              InputProps={{
                                minRows: 1,
                                rows: 5,
                              }}
                              value={textReview}
                              onChange={handleChangeReview}
                            />
                          </Grid>
                        </Grid>

                        <ButtonGroup
                          style={{
                            marginTop: '10px',
                            width: '100%',
                            displey: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Button
                            onClick={handleCloseReview}
                            variant='contained'
                            style={{
                              backgroundColor: 'red',
                              marginTop: '1%',

                              width: '90%',
                              color: '#ffff',
                              borderRadius: '10',
                            }}
                            sx={{ mt: 2, mb: 2 }}
                          >
                            Close
                          </Button>
                          <Button
                            onClick={handleSubmitReview}
                            variant='contained'
                            style={{
                              backgroundColor: 'green',
                              marginTop: '1%',
                              marginLeft: '20px',
                              width: '90%',
                              color: '#ffff',
                              borderRadius: '10',
                            }}
                            sx={{ mt: 2, mb: 2 }}
                          >
                            Submit
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </Box>
                  </Container>
                </div>
              </Modal>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}