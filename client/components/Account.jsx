import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button,
  Container,
  Switch,
  FormControlLabel,
  Typography,
  TextField,
  Stack,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import md5 from 'md5'

import { editSettings } from '../actions'

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const settings = useSelector((state) => state.settings)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    getProfile()
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      const { user } = session

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { user } = session

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = (e) => {
    const { user } = session

    dispatch(
      editSettings(user.id, {
        ...settings,
        [e.target.name]: e.target.checked,
      })
    )
  }

  const handleLogout = async () => {
    navigate('/')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Container>
      {loading ? (
        'Saving ...'
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
          <Typography variant="h2" align="center">
            Profile
          </Typography>
          <Stack spacing={2}>
            <Container
              component="img"
              sx={{
                width: '200px',
              }}
              src={
                avatar_url
                  ? avatar_url
                  : `https://www.gravatar.com/avatar/${md5(session.user.email)}`
              }
              alt={`${username} avatar`}
            />

            <Typography variant="body1" gutterBottom>
              Email: {session.user.email}
            </Typography>
            <TextField
              id="username"
              type="text"
              label="Username"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              id="avatar"
              type="url"
              label="Avatar URL"
              value={avatar_url || ''}
              onChange={(e) => setAvatarUrl(e.target.value)}
              fullWidth
            />
            <TextField
              id="website"
              type="url"
              label="Website"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControlLabel
              className="justify-content-md-center"
              control={
                <Switch
                  aria-label="Fahrenheit"
                  checked={Boolean(settings.imperial_temperature)}
                  name="imperial_temperature"
                  onChange={updateSettings}
                  color="primary"
                />
              }
              label="Fahrenheit"
            />
            <FormControlLabel
              className="justify-content-md-center"
              control={
                <Switch
                  aria-label="Imperial Units"
                  checked={Boolean(settings.imperial_units)}
                  name="imperial_units"
                  onChange={updateSettings}
                  color="primary"
                />
              }
              label="Imperial Units"
            />
            <FormControlLabel
              className="justify-content-md-center"
              control={
                <Switch
                  aria-label="Ounces"
                  checked={Boolean(settings.ounces)}
                  name="ounces"
                  onChange={updateSettings}
                  color="primary"
                />
              }
              label="Ounces"
            />
            <FormControlLabel
              className="justify-content-md-center"
              control={
                <Switch
                  aria-label="Calories"
                  checked={Boolean(settings.calories)}
                  name="calories"
                  onChange={updateSettings}
                  color="primary"
                />
              }
              label="Calories"
            />
          </Stack>
          <Stack spacing={2}>
            <Button variant="contained" disabled={loading}>
              Update profile
            </Button>
            <Button variant="outlined" onClick={handleLogout}>
              Sign Out
            </Button>
          </Stack>
        </form>
      )}
    </Container>
  )
}

export default Account
