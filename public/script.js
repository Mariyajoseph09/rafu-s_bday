/**
 * RAFAEL'S 1ST BIRTHDAY CELEBRATION INVITATION
 * Single-Page Interactive Engine with Rich Animations
 */

(function () {
  'use strict';

  // ==========================================
  // 1. DEFAULT DATA & STATE MANAGEMENT
  // ==========================================
  // Paste your Google Apps Script Web App URL below to save all guest RSVPs to Google Sheets
  const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxil5wdx1eLf48F6CIpWaQ13yzssIWLgCBhvugEUTfUX0YCgMV8z8mKxLL3TupztfUN/exec';

  // Editable Baby Memory Album Data (Add, remove, or reorder entries here)
  const BABY_GALLERY_PHOTOS = [
    {
      src: 'public/images/baby-gallery/baby-01.jpg',
      alt: 'Baby Rafael smiling brightly outdoors',
      caption: 'Our Little Sunshine'
    },
    {
      src: 'public/images/baby-gallery/baby-02.jpg',
      alt: 'Baby Rafael laughing happily in his bear shirt',
      caption: 'Those Beautiful Smiles'
    },
    {
      src: 'public/images/baby-gallery/baby-03.jpg',
      alt: 'Baby Rafael peeking sweetly over shoulder',
      caption: 'Our Bundle of Joy'
    },
    {
      src: 'public/images/baby-gallery/baby-04.jpg',
      alt: 'Baby Rafael wrapped cozily in a soft white blanket',
      caption: 'Cozy Blanket Cuddles'
    },
    {
      src: 'public/images/baby-gallery/baby-05.jpg',
      alt: 'Baby Rafael smiling during tummy time beside his elephant toy',
      caption: 'Little Hands, Big Dreams'
    },
    {
      src: 'public/images/baby-gallery/baby-06.jpg',
      alt: 'Baby Rafael outdoors with soft curls and a sweet smile',
      caption: 'Sweet Curly Smiles'
    },
    {
      src: 'public/images/baby-gallery/baby-07.jpg',
      alt: 'Baby Rafael grinning happily in his fox t-shirt',
      caption: 'Pure Joy Every Day'
    },
    {
      src: 'public/images/baby-gallery/baby-08.jpg',
      alt: 'Baby Rafael looking up full of wonder',
      caption: 'Growing Up So Fast'
    },
    {
      src: 'public/images/baby-gallery/baby-09.jpg',
      alt: 'Baby Rafael playing with his colorful ball',
      caption: 'Curious Little Explorer'
    },
    {
      src: 'public/images/baby-gallery/baby-10.jpg',
      alt: 'Baby Rafael held warmly in Dad arms outdoors',
      caption: 'Held Safe & Loved'
    },
    {
      src: 'public/images/baby-gallery/baby-11.jpg',
      alt: 'Baby Rafael waving hello with a joyful smile',
      caption: 'Hello Big World!'
    },
    {
      src: 'public/images/baby-gallery/baby-12.jpg',
      alt: 'Mom and Dad lifting baby Rafael joyfully at sunset',
      caption: 'Forever Our Baby'
    }
  ];

  const DEFAULT_EVENT_DATA = {
    nickName: 'Rafael',
    fullName: 'Rafael Richy Benedict',
    eventDate: '2026-12-09', // December 9th
    eventTime: '19:30',      // 7:30 PM (24h)
    venueName: 'Celebration Venue',
    venueCity: 'Tap for Google Maps 📍',
    venueAddress: 'https://maps.app.goo.gl/dVaq5fmaRATvLRV79?g_st=aw',
    rsvpDeadline: 'December 1st'
  };

  let eventData = { ...DEFAULT_EVENT_DATA };
  try {
    const savedData = localStorage.getItem('rafu_event_data_v2');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      let migrated = false;
      if (typeof parsed.nickName === 'string' && /^(rafu|rafeal)$/i.test(parsed.nickName.trim())) {
        parsed.nickName = 'Rafael';
        migrated = true;
      }
      if (typeof parsed.fullName === 'string' && /(rafu|rafeal)/i.test(parsed.fullName)) {
        parsed.fullName = DEFAULT_EVENT_DATA.fullName;
        migrated = true;
      }
      if (parsed.eventTime === '16:30' || parsed.eventTime === '04:30') {
        parsed.eventTime = '19:30';
        migrated = true;
      }
      if (parsed.venueAddress && parsed.venueAddress.includes('j1ZFTZy9tnqqyLXz6')) {
        parsed.venueAddress = DEFAULT_EVENT_DATA.venueAddress;
        migrated = true;
      }
      eventData = { ...DEFAULT_EVENT_DATA, ...parsed };
      if (migrated) {
        localStorage.setItem('rafu_event_data_v2', JSON.stringify(eventData));
      }
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  let rsvpList = [];
  try {
    const savedRsvps = localStorage.getItem('rafu_rsvps');
    if (savedRsvps) {
      rsvpList = JSON.parse(savedRsvps);
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  // ==========================================
  // 2. DOM ELEMENTS
  // ==========================================
  const homeScroll = document.getElementById('homeScroll');
  const scrollExploreBtn = document.getElementById('scrollExploreBtn');
  const specialPlayBtn = document.getElementById('specialPlayBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const vinylDisc = document.getElementById('vinylDisc');
  const audioStatusText = document.getElementById('audioStatusText');
  const playIconTriangle = document.getElementById('playIconTriangle');

  // Display elements
  const displayNickName = document.getElementById('displayNickName');
  const displayFullName = document.getElementById('displayFullName');
  const cardMonth = document.getElementById('cardMonth');
  const cardDay = document.getElementById('cardDay');
  const cardYear = document.getElementById('cardYear');
  const cardTime = document.getElementById('cardTime');
  const cardTimeAmPm = document.getElementById('cardTimeAmPm');
  const cardVenueName = document.getElementById('cardVenueName');
  const cardVenueCity = document.getElementById('cardVenueCity');
  const rsvpDeadlineDate = document.getElementById('rsvpDeadlineDate');

  // Countdown elements
  const timerDays = document.getElementById('timerDays');
  const timerHours = document.getElementById('timerHours');
  const timerMins = document.getElementById('timerMins');
  const timerSecs = document.getElementById('timerSecs');

  // RSVP Form elements
  const rsvpForm = document.getElementById('rsvpForm');
  const guestNameInput = document.getElementById('guestNameInput');
  const btnAttendYes = document.getElementById('btnAttendYes');
  const btnAttendNo = document.getElementById('btnAttendNo');
  const guestCountInput = document.getElementById('guestCountInput');
  const btnDecGuests = document.getElementById('btnDecGuests');
  const btnIncGuests = document.getElementById('btnIncGuests');
  const guestCountGroup = document.getElementById('guestCountGroup');
  const guestMessageInput = document.getElementById('guestMessageInput');
  const rsvpSuccessCard = document.getElementById('rsvpSuccessCard');
  const successDetailsPill = document.getElementById('successDetailsPill');
  const btnEditRsvp = document.getElementById('btnEditRsvp');
  const btnSubmitRsvp = document.getElementById('btnSubmitRsvp');
  const guestCountTotal = document.getElementById('guestCountTotal');

  // Customizer Modal
  const openCustomizerBtn = document.getElementById('openCustomizerBtn');
  const customizerModal = document.getElementById('customizerModal');
  const closeCustomizerBtn = document.getElementById('closeCustomizerBtn');
  const saveCustomizerBtn = document.getElementById('saveCustomizerBtn');
  const resetCustomizerBtn = document.getElementById('resetCustomizerBtn');
  const editNickName = document.getElementById('editNickName');
  const editFullName = document.getElementById('editFullName');
  const editEventDate = document.getElementById('editEventDate');
  const editEventTime = document.getElementById('editEventTime');
  const editVenueName = document.getElementById('editVenueName');
  const editVenueAddress = document.getElementById('editVenueAddress');
  const editRsvpDeadline = document.getElementById('editRsvpDeadline');

  // Host Drawer Modal
  const btnOpenHostDrawer = document.getElementById('btnOpenHostDrawer');
  const hostDrawerModal = document.getElementById('hostDrawerModal');
  const closeHostDrawerBtn = document.getElementById('closeHostDrawerBtn');
  const closeHostDrawerBtn2 = document.getElementById('closeHostDrawerBtn2');
  const statYesCount = document.getElementById('statYesCount');
  const statNoCount = document.getElementById('statNoCount');
  const modalTotalGuests = document.getElementById('modalTotalGuests');
  const guestListContainer = document.getElementById('guestListContainer');
  const exportRsvpBtn = document.getElementById('exportRsvpBtn');

  // Photo gallery & viewer
  const customPhotoUpload = document.getElementById('customPhotoUpload');
  const photoCarousel = document.getElementById('photoCarousel');
  const photoViewerModal = document.getElementById('photoViewerModal');
  const photoViewerImg = document.getElementById('photoViewerImg');
  const photoViewerCaption = document.getElementById('photoViewerCaption');
  const closePhotoViewerBtn = document.getElementById('closePhotoViewerBtn');
  const babyPhotoTrigger = document.getElementById('babyPhotoTrigger');
  const mainBabyPhoto = document.getElementById('mainBabyPhoto');

  // Quick action buttons
  const getDirectionsBtn = document.getElementById('getDirectionsBtn');
  const addToCalBtn = document.getElementById('addToCalBtn');
  const shareInviteBtn = document.getElementById('shareInviteBtn');
  const venueCardClickable = document.getElementById('venueCardClickable');

  // Interactive animated elements
  const bottomSittingBear = document.getElementById('bottomSittingBear');
  const interactiveBearHolder = document.getElementById('interactiveBearHolder');

  let isPlayingMusic = false;
  let userManuallyPaused = false;
  let audioCtx = null;
  let musicInterval = null;
  let currentNoteIndex = 0;
  let attendChoice = 'yes';

  // ==========================================
  // 3. SMOOTH SCROLLING NAVIGATION
  // ==========================================
  function scrollToElement(targetId) {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Gentle pulse highlight
      el.style.transition = 'box-shadow 0.4s ease';
      el.style.boxShadow = '0 0 20px rgba(138, 154, 132, 0.4)';
      setTimeout(() => {
        el.style.boxShadow = '';
      }, 1200);
    }
  }

  // "What's Inside" click handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.scroll;
      scrollToElement(targetId);
    });
  });

  // Header quick jump links & mobile hamburger menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  function setMobileMenuOpen(open) {
    if (!mobileMenuBtn || !mobileNavDrawer) return;
    mobileMenuBtn.classList.toggle('is-open', open);
    mobileNavDrawer.classList.toggle('is-open', open);
    mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNavDrawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.contains('is-open');
      setMobileMenuOpen(!isOpen);
    });

    document.addEventListener('click', (e) => {
      if (
        mobileNavDrawer.classList.contains('is-open') &&
        !mobileNavDrawer.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('is-open')) {
        setMobileMenuOpen(false);
        mobileMenuBtn.focus();
      }
    });
  }

  document.querySelectorAll('.quick-link, .mobile-nav-link, .header-logo-badge').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const targetId = href.replace('#', '');
      setMobileMenuOpen(false);
      scrollToElement(targetId);
    });
  });

  if (scrollExploreBtn) {
    scrollExploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      playChimeEffect();
      triggerConfetti();
      startMusicBox();
      scrollToElement('announcementSection');
    });
  }

  // ==========================================
  // 4. AUDIO ENGINE (SWEET MUSIC-BOX SYNTHESIZER)
  // Traditional "Happy Birthday to You" with soft kalimba tones
  // ==========================================
  const BIRTHDAY_MELODY = [
    { note: 261.63, dur: 0.35, pause: 0.1 }, // C4
    { note: 261.63, dur: 0.25, pause: 0.1 }, // C4
    { note: 293.66, dur: 0.6, pause: 0.15 }, // D4
    { note: 261.63, dur: 0.6, pause: 0.15 }, // C4
    { note: 349.23, dur: 0.6, pause: 0.15 }, // F4
    { note: 329.63, dur: 1.1, pause: 0.3 },  // E4

    { note: 261.63, dur: 0.35, pause: 0.1 }, // C4
    { note: 261.63, dur: 0.25, pause: 0.1 }, // C4
    { note: 293.66, dur: 0.6, pause: 0.15 }, // D4
    { note: 261.63, dur: 0.6, pause: 0.15 }, // C4
    { note: 392.00, dur: 0.6, pause: 0.15 }, // G4
    { note: 349.23, dur: 1.1, pause: 0.3 },  // F4

    { note: 261.63, dur: 0.35, pause: 0.1 }, // C4
    { note: 261.63, dur: 0.25, pause: 0.1 }, // C4
    { note: 523.25, dur: 0.6, pause: 0.15 }, // C5
    { note: 440.00, dur: 0.6, pause: 0.15 }, // A4
    { note: 349.23, dur: 0.6, pause: 0.15 }, // F4
    { note: 329.63, dur: 0.6, pause: 0.15 }, // E4
    { note: 293.66, dur: 0.9, pause: 0.3 },  // D4

    { note: 466.16, dur: 0.35, pause: 0.1 }, // Bb4
    { note: 466.16, dur: 0.25, pause: 0.1 }, // Bb4
    { note: 440.00, dur: 0.6, pause: 0.15 }, // A4
    { note: 349.23, dur: 0.6, pause: 0.15 }, // F4
    { note: 392.00, dur: 0.6, pause: 0.15 }, // G4
    { note: 349.23, dur: 1.4, pause: 0.8 },  // F4
  ];

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playMusicBoxNote(freq, duration) {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, ctx.currentTime);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.6);
    } catch (e) {
      console.warn('Audio playback not supported:', e);
    }
  }

  function playChimeEffect() {
    try {
      const ctx = getAudioContext();
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        setTimeout(() => {
          playMusicBoxNote(freq, 0.4);
        }, idx * 90);
      });
    } catch (e) { }
  }

  function stepMelody() {
    if (!isPlayingMusic) return;
    const noteData = BIRTHDAY_MELODY[currentNoteIndex];
    playMusicBoxNote(noteData.note, noteData.dur);

    currentNoteIndex = (currentNoteIndex + 1) % BIRTHDAY_MELODY.length;
    const nextWait = (noteData.dur + noteData.pause) * 1000;
    musicInterval = setTimeout(stepMelody, nextWait);
  }

  function startMusicBox() {
    if (isPlayingMusic) return;
    isPlayingMusic = true;
    currentNoteIndex = 0;
    updateAudioUI();
    getAudioContext();
    clearTimeout(musicInterval);
    stepMelody();
  }

  function stopMusicBox() {
    isPlayingMusic = false;
    clearTimeout(musicInterval);
    updateAudioUI();
  }

  function toggleMusic() {
    if (isPlayingMusic) {
      userManuallyPaused = true;
      stopMusicBox();
    } else {
      userManuallyPaused = false;
      startMusicBox();
    }
  }

  function updateAudioUI() {
    if (isPlayingMusic) {
      if (vinylDisc) vinylDisc.classList.add('spinning');
      if (audioToggleBtn) audioToggleBtn.classList.add('playing');
      if (playIconTriangle) playIconTriangle.textContent = '⏸';
      if (audioStatusText) audioStatusText.textContent = 'Playing Song ♪';
    } else {
      if (vinylDisc) vinylDisc.classList.remove('spinning');
      if (audioToggleBtn) audioToggleBtn.classList.remove('playing');
      if (playIconTriangle) playIconTriangle.textContent = '▶';
      if (audioStatusText) audioStatusText.textContent = 'Tap to Listen ♪';
    }
  }

  function tryAutoPlayMusic() {
    if (userManuallyPaused || isPlayingMusic) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtx) {
        audioCtx = new AudioCtx();
      }

      const startIfRunning = () => {
        if (!userManuallyPaused && !isPlayingMusic && audioCtx && audioCtx.state === 'running') {
          startMusicBox();
          detachAutoPlayUnlock();
        }
      };

      if (audioCtx.state === 'running') {
        startIfRunning();
        return;
      }

      const resumePromise = audioCtx.resume();
      if (resumePromise && typeof resumePromise.then === 'function') {
        resumePromise.then(startIfRunning).catch(() => {});
      }
    } catch (e) {
      console.warn('Auto-play audio skipped:', e);
    }
  }

  function handleFirstGestureForAudio(e) {
    if (userManuallyPaused || isPlayingMusic) {
      detachAutoPlayUnlock();
      return;
    }
    if (audioToggleBtn && (e.target === audioToggleBtn || audioToggleBtn.contains(e.target))) {
      detachAutoPlayUnlock();
      return;
    }
    tryAutoPlayMusic();
  }

  function detachAutoPlayUnlock() {
    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(evt => {
      document.removeEventListener(evt, handleFirstGestureForAudio, true);
    });
  }

  ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(evt => {
    document.addEventListener(evt, handleFirstGestureForAudio, { capture: true, passive: true });
  });

  if (specialPlayBtn) specialPlayBtn.addEventListener('click', toggleMusic);
  if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleMusic);

  // Attempt automatic playback when the page opens
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAutoPlayMusic);
  } else {
    tryAutoPlayMusic();
  }
  window.addEventListener('load', tryAutoPlayMusic);

  // ==========================================
  // 5. INTERACTIVE ANIMATIONS: BALLOONS & BEARS
  // ==========================================
  // Tapping the Bear with Balloons triggers bounce + sparkles
  if (interactiveBearHolder) {
    interactiveBearHolder.addEventListener('click', () => {
      playChimeEffect();
      triggerConfetti();
      interactiveBearHolder.style.transform = 'scale(1.08) rotate(2deg)';
      setTimeout(() => {
        interactiveBearHolder.style.transform = '';
      }, 350);
    });
  }

  // Tapping the bottom sitting bear
  if (bottomSittingBear) {
    bottomSittingBear.addEventListener('click', () => {
      playMusicBoxNote(783.99, 0.4);
      setTimeout(() => playMusicBoxNote(1046.50, 0.5), 120);
      bottomSittingBear.style.transform = 'scale(1.3) rotate(8deg)';
      setTimeout(() => {
        bottomSittingBear.style.transform = '';
      }, 400);
    });
  }

  // Tapping any ambient balloon in the sky
  document.querySelectorAll('.sky-balloon, .car-balloon, .floating-heart-bubble').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      playMusicBoxNote(659.25, 0.35);
      b.style.transform = 'scale(1.5) rotate(-15deg)';
      setTimeout(() => {
        b.style.transform = '';
      }, 300);
    });
  });

  // ==========================================
  // 6. LIVE COUNTDOWN TIMER
  // ==========================================
  function updateCountdown() {
    const dateTimeStr = `${eventData.eventDate}T${eventData.eventTime}:00`;
    let target = new Date(dateTimeStr);

    if (isNaN(target.getTime())) {
      target = new Date('2026-12-09T19:30:00');
    }

    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      if (timerDays) timerDays.textContent = '00';
      if (timerHours) timerHours.textContent = '00';
      if (timerMins) timerMins.textContent = '00';
      if (timerSecs) timerSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
    if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
    if (timerMins) timerMins.textContent = String(minutes).padStart(2, '0');
    if (timerSecs) timerSecs.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================
  // 7. RENDER EVENT DETAILS ACROSS THE APP
  // ==========================================
  function renderEventDetails() {
    if (displayNickName) displayNickName.textContent = `${eventData.nickName} Turns One!`;
    if (displayFullName) displayFullName.textContent = eventData.fullName;

    const dateObj = new Date(`${eventData.eventDate}T12:00:00`);
    if (!isNaN(dateObj.getTime())) {
      const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      if (cardMonth) cardMonth.textContent = months[dateObj.getMonth()];
      if (cardDay) cardDay.textContent = String(dateObj.getDate()).padStart(2, '0');
      if (cardYear) cardYear.textContent = String(dateObj.getFullYear());
    }

    const [hStr, mStr] = eventData.eventTime.split(':');
    let h = parseInt(hStr || '19', 10);
    const m = mStr || '30';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    if (cardTime) cardTime.textContent = `${String(h12).padStart(2, '0')}:${m}`;
    if (cardTimeAmPm) cardTimeAmPm.textContent = ampm;

    if (cardVenueName) cardVenueName.textContent = eventData.venueName;
    if (cardVenueCity) cardVenueCity.textContent = eventData.venueCity || 'Tap for Google Maps 📍';
    if (rsvpDeadlineDate) rsvpDeadlineDate.textContent = eventData.rsvpDeadline;

    updateCountdown();
  }

  renderEventDetails();

  // ==========================================
  // 8. RSVP FORM LOGIC
  // ==========================================
  if (btnAttendYes && btnAttendNo) {
    btnAttendYes.addEventListener('click', () => {
      attendChoice = 'yes';
      btnAttendYes.classList.add('active');
      btnAttendNo.classList.remove('active');
      if (guestCountGroup) guestCountGroup.style.display = 'flex';
    });

    btnAttendNo.addEventListener('click', () => {
      attendChoice = 'no';
      btnAttendNo.classList.add('active');
      btnAttendYes.classList.remove('active');
      if (guestCountGroup) guestCountGroup.style.display = 'none';
    });
  }

  if (btnDecGuests && btnIncGuests && guestCountInput) {
    btnDecGuests.addEventListener('click', () => {
      let val = parseInt(guestCountInput.value, 10) || 1;
      if (val > 1) guestCountInput.value = val - 1;
    });

    btnIncGuests.addEventListener('click', () => {
      let val = parseInt(guestCountInput.value, 10) || 1;
      if (val < 10) guestCountInput.value = val + 1;
    });
  }

  async function saveRsvpToGoogleSheet(rsvpEntry) {
    const url = (GOOGLE_SHEETS_WEBAPP_URL || '').trim();
    if (!url) {
      return { sent: false, reason: 'missing_url' };
    }
    try {
      const formBody = new URLSearchParams({
        name: String(rsvpEntry.name || ''),
        attending: String(rsvpEntry.attending || 'yes'),
        guests: String(rsvpEntry.guests ?? 0),
        message: String(rsvpEntry.message || ''),
        timestamp: String(rsvpEntry.timestamp || new Date().toISOString())
      });

      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: formBody
      });
      return { sent: true };
    } catch (err) {
      console.warn('Google Sheets RSVP sync failed:', err);
      return { sent: false, reason: 'network_error' };
    }
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const guestName = guestNameInput.value.trim();
      if (!guestName) {
        guestNameInput.focus();
        return;
      }

      const guestCount = attendChoice === 'yes' ? parseInt(guestCountInput.value, 10) || 1 : 0;
      const guestMsg = guestMessageInput.value.trim();

      const newRsvp = {
        id: Date.now(),
        name: guestName,
        attending: attendChoice,
        guests: guestCount,
        message: guestMsg,
        timestamp: new Date().toISOString()
      };

      const submitBtnLabel = btnSubmitRsvp ? btnSubmitRsvp.querySelector('span') : null;
      if (btnSubmitRsvp) btnSubmitRsvp.disabled = true;
      if (submitBtnLabel) submitBtnLabel.textContent = 'SAVING RESPONSE...';

      rsvpList.push({
        ...newRsvp,
        timestamp: new Date().toLocaleDateString()
      });
      try {
        localStorage.setItem('rafu_rsvps', JSON.stringify(rsvpList));
      } catch (err) { }

      await saveRsvpToGoogleSheet(newRsvp);

      if (btnSubmitRsvp) btnSubmitRsvp.disabled = false;
      if (submitBtnLabel) submitBtnLabel.textContent = 'SEND RESPONSE';

      triggerConfetti();
      playChimeEffect();

      if (rsvpForm) rsvpForm.style.display = 'none';
      if (rsvpSuccessCard) {
        rsvpSuccessCard.classList.remove('hidden');
        if (attendChoice === 'yes') {
          successDetailsPill.textContent = `Registered for ${guestName} + ${guestCount > 1 ? (guestCount - 1) + ' guest(s)' : '1 person'}. See you there!`;
        } else {
          successDetailsPill.textContent = `Thank you ${guestName} for letting us know! We'll miss you.`;
        }
      }

      updateGuestCountBadge();
    });
  }

  if (btnEditRsvp) {
    btnEditRsvp.addEventListener('click', () => {
      if (rsvpSuccessCard) rsvpSuccessCard.classList.add('hidden');
      if (rsvpForm) rsvpForm.style.display = 'flex';
    });
  }

  function updateGuestCountBadge() {
    const totalAttending = rsvpList.reduce((acc, curr) => curr.attending === 'yes' ? acc + (curr.guests || 1) : acc, 0);
    if (guestCountTotal) guestCountTotal.textContent = String(totalAttending);
    if (modalTotalGuests) modalTotalGuests.textContent = String(totalAttending);
  }

  updateGuestCountBadge();

  // Host RSVP Drawer Modal
  function openHostDrawer() {
    if (!hostDrawerModal) return;
    hostDrawerModal.classList.remove('hidden');

    const yesList = rsvpList.filter(r => r.attending === 'yes');
    const noList = rsvpList.filter(r => r.attending === 'no');
    const totalAttending = yesList.reduce((acc, curr) => acc + (curr.guests || 1), 0);

    if (statYesCount) statYesCount.textContent = String(totalAttending);
    if (statNoCount) statNoCount.textContent = String(noList.length);
    if (modalTotalGuests) modalTotalGuests.textContent = String(totalAttending);

    if (guestListContainer) {
      if (rsvpList.length === 0) {
        guestListContainer.innerHTML = '<p class="empty-list-notice">No responses received yet. Be the first to reply!</p>';
      } else {
        guestListContainer.innerHTML = rsvpList.map(item => `
          <div class="guest-row-card">
            <div class="guest-info-left">
              <span class="guest-name-text">${escapeHtml(item.name)} ${item.attending === 'yes' ? `(${item.guests} attending)` : ''}</span>
              ${item.message ? `<span class="guest-wish-quote">"${escapeHtml(item.message)}"</span>` : ''}
            </div>
            <span class="${item.attending === 'yes' ? 'guest-tag-yes' : 'guest-tag-no'}">
              ${item.attending === 'yes' ? 'ATTENDING' : 'DECLINED'}
            </span>
          </div>
        `).join('');
      }
    }
  }

  if (btnOpenHostDrawer) btnOpenHostDrawer.addEventListener('click', openHostDrawer);
  if (closeHostDrawerBtn) closeHostDrawerBtn.addEventListener('click', () => hostDrawerModal.classList.add('hidden'));
  if (closeHostDrawerBtn2) closeHostDrawerBtn2.addEventListener('click', () => hostDrawerModal.classList.add('hidden'));

  // Export CSV
  if (exportRsvpBtn) {
    exportRsvpBtn.addEventListener('click', () => {
      if (rsvpList.length === 0) {
        alert('No responses to export yet!');
        return;
      }
      let csv = 'Name,Attending,Guests,Message,Date\n';
      rsvpList.forEach(r => {
        csv += `"${r.name}","${r.attending}","${r.guests}","${(r.message || '').replace(/"/g, '""')}","${r.timestamp}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `rafu_birthday_rsvps.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ==========================================
  // 9. BABY PHOTO ALBUM SLIDESHOW & FULL-SCREEN LIGHTBOX
  // ==========================================
  const galleryViewport = document.getElementById('galleryViewport');
  const gallerySlidesContainer = document.getElementById('gallerySlidesContainer');
  const galleryDots = document.getElementById('galleryDots');
  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  const galleryNextBtn = document.getElementById('galleryNextBtn');
  const galleryZoomTrigger = document.getElementById('galleryZoomTrigger');
  const galleryCaptionText = document.getElementById('galleryCaptionText');
  const galleryCounter = document.getElementById('galleryCounter');
  const albumGalleryRoot = document.getElementById('albumGalleryRoot');

  const lightboxStage = document.getElementById('lightboxStage');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentSlideIndex = 0;
  let slideshowTimer = null;
  let isGalleryPaused = false;
  let isLightboxGalleryMode = false;
  const SLIDESHOW_INTERVAL_MS = 4000;
  const reducedMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function renderGallerySlides() {
    if (!gallerySlidesContainer || !galleryDots || !BABY_GALLERY_PHOTOS.length) return;

    gallerySlidesContainer.innerHTML = BABY_GALLERY_PHOTOS.map((photo, idx) => `
      <div class="album-slide ${idx === 0 ? 'is-active' : ''}" data-slide-index="${idx}" aria-hidden="${idx === 0 ? 'false' : 'true'}">
        <div class="album-slide-ambient" style="background-image: url('${escapeHtml(photo.src)}');" aria-hidden="true"></div>
        <img
          src="${escapeHtml(photo.src)}"
          alt="${escapeHtml(photo.alt || 'Baby Rafael memory')}"
          class="album-slide-img"
          loading="${idx < 2 ? 'eager' : 'lazy'}"
          decoding="async"
        >
      </div>
    `).join('');

    galleryDots.innerHTML = BABY_GALLERY_PHOTOS.map((photo, idx) => `
      <button
        type="button"
        class="album-dot ${idx === 0 ? 'is-active' : ''}"
        data-dot-index="${idx}"
        role="tab"
        aria-selected="${idx === 0 ? 'true' : 'false'}"
        aria-label="View photo ${idx + 1}: ${escapeHtml(photo.caption || 'Memory')}"
      ></button>
    `).join('');

    galleryDots.querySelectorAll('.album-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.dotIndex, 10);
        goToSlide(idx, true);
      });
    });

    updateSlideUI();
  }

  function updateSlideUI() {
    if (!gallerySlidesContainer || !BABY_GALLERY_PHOTOS.length) return;
    const total = BABY_GALLERY_PHOTOS.length;
    const current = BABY_GALLERY_PHOTOS[currentSlideIndex];

    gallerySlidesContainer.querySelectorAll('.album-slide').forEach((slide, idx) => {
      const active = idx === currentSlideIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    if (galleryDots) {
      galleryDots.querySelectorAll('.album-dot').forEach((dot, idx) => {
        const active = idx === currentSlideIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    if (galleryCounter) {
      galleryCounter.textContent = `${currentSlideIndex + 1} / ${total}`;
    }

    if (galleryCaptionText && current) {
      galleryCaptionText.classList.remove('caption-fade-in');
      void galleryCaptionText.offsetWidth;
      galleryCaptionText.textContent = current.caption || '';
      galleryCaptionText.classList.add('caption-fade-in');
    }

    if (isLightboxGalleryMode && photoViewerModal && !photoViewerModal.classList.contains('hidden')) {
      syncLightboxWithCurrentSlide();
    }
  }

  function goToSlide(nextIndex, isManual) {
    const total = BABY_GALLERY_PHOTOS.length;
    if (!total) return;
    currentSlideIndex = ((nextIndex % total) + total) % total;
    updateSlideUI();
    if (isManual) {
      resetSlideshowTimer();
    }
  }

  function startSlideshowTimer() {
    clearInterval(slideshowTimer);
    if (reducedMotionQuery && reducedMotionQuery.matches) return;
    if (document.hidden || isGalleryPaused || BABY_GALLERY_PHOTOS.length <= 1) return;
    if (photoViewerModal && !photoViewerModal.classList.contains('hidden')) return;

    slideshowTimer = setInterval(() => {
      goToSlide(currentSlideIndex + 1, false);
    }, SLIDESHOW_INTERVAL_MS);
  }

  function resetSlideshowTimer() {
    clearInterval(slideshowTimer);
    startSlideshowTimer();
  }

  function pauseSlideshow() {
    isGalleryPaused = true;
    clearInterval(slideshowTimer);
  }

  function resumeSlideshow() {
    isGalleryPaused = false;
    startSlideshowTimer();
  }

  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex - 1, true);
    });
  }

  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex + 1, true);
    });
  }

  if (albumGalleryRoot) {
    albumGalleryRoot.addEventListener('mouseenter', pauseSlideshow);
    albumGalleryRoot.addEventListener('mouseleave', resumeSlideshow);
    albumGalleryRoot.addEventListener('focusin', pauseSlideshow);
    albumGalleryRoot.addEventListener('focusout', (e) => {
      if (!albumGalleryRoot.contains(e.relatedTarget)) {
        resumeSlideshow();
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(slideshowTimer);
    } else {
      startSlideshowTimer();
    }
  });

  if (reducedMotionQuery && typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', () => {
      if (reducedMotionQuery.matches) {
        clearInterval(slideshowTimer);
      } else {
        startSlideshowTimer();
      }
    });
  }

  // Touch swipe on the main album stage
  if (galleryViewport) {
    let touchStartX = 0;
    let touchStartY = 0;
    galleryViewport.addEventListener('touchstart', (e) => {
      if (!e.touches.length) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      pauseSlideshow();
    }, { passive: true });

    galleryViewport.addEventListener('touchend', (e) => {
      if (!e.changedTouches.length) {
        resumeSlideshow();
        return;
      }
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
        goToSlide(dx < 0 ? currentSlideIndex + 1 : currentSlideIndex - 1, true);
      }
      setTimeout(resumeSlideshow, 1200);
    }, { passive: true });
  }

  // Lightbox Controls
  function syncLightboxWithCurrentSlide() {
    const photo = BABY_GALLERY_PHOTOS[currentSlideIndex];
    if (!photo || !photoViewerImg) return;
    photoViewerImg.src = photo.src;
    photoViewerImg.alt = photo.alt || 'Baby Rafael Full View';
    if (photoViewerCaption) photoViewerCaption.textContent = photo.caption || '';
    if (lightboxCounter) lightboxCounter.textContent = `${currentSlideIndex + 1} / ${BABY_GALLERY_PHOTOS.length}`;
  }

  function openGalleryLightbox(index) {
    if (!photoViewerModal) return;
    isLightboxGalleryMode = true;
    currentSlideIndex = ((index % BABY_GALLERY_PHOTOS.length) + BABY_GALLERY_PHOTOS.length) % BABY_GALLERY_PHOTOS.length;
    updateSlideUI();
    syncLightboxWithCurrentSlide();
    if (lightboxPrevBtn) lightboxPrevBtn.style.display = '';
    if (lightboxNextBtn) lightboxNextBtn.style.display = '';
    if (lightboxCounter) lightboxCounter.style.display = '';
    photoViewerModal.classList.remove('hidden');
    clearInterval(slideshowTimer);
  }

  function openPhotoModal(src, caption) {
    if (!photoViewerModal) return;
    isLightboxGalleryMode = false;
    photoViewerImg.src = src;
    photoViewerImg.alt = caption || 'Baby Rafael Full View';
    if (photoViewerCaption) photoViewerCaption.textContent = caption || 'Baby Rafael - Our Little Star';
    if (lightboxPrevBtn) lightboxPrevBtn.style.display = 'none';
    if (lightboxNextBtn) lightboxNextBtn.style.display = 'none';
    if (lightboxCounter) lightboxCounter.style.display = 'none';
    photoViewerModal.classList.remove('hidden');
    clearInterval(slideshowTimer);
  }

  function closePhotoModal() {
    if (!photoViewerModal) return;
    photoViewerModal.classList.add('hidden');
    isLightboxGalleryMode = false;
    startSlideshowTimer();
  }

  if (galleryZoomTrigger) {
    galleryZoomTrigger.addEventListener('click', () => {
      openGalleryLightbox(currentSlideIndex);
    });
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex - 1, false);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex + 1, false);
    });
  }

  if (babyPhotoTrigger) {
    babyPhotoTrigger.addEventListener('click', () => {
      if (mainBabyPhoto) openPhotoModal(mainBabyPhoto.src, `${eventData.fullName} (${eventData.nickName})`);
    });
  }

  if (closePhotoViewerBtn) {
    closePhotoViewerBtn.addEventListener('click', closePhotoModal);
  }

  if (photoViewerModal) {
    photoViewerModal.addEventListener('click', (e) => {
      if (e.target === photoViewerModal) {
        closePhotoModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!photoViewerModal || photoViewerModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') {
      closePhotoModal();
    } else if (isLightboxGalleryMode && e.key === 'ArrowLeft') {
      goToSlide(currentSlideIndex - 1, false);
    } else if (isLightboxGalleryMode && e.key === 'ArrowRight') {
      goToSlide(currentSlideIndex + 1, false);
    }
  });

  // Mobile swipe inside Full-Screen Lightbox
  if (lightboxStage) {
    let lbTouchStartX = 0;
    let lbTouchStartY = 0;
    lightboxStage.addEventListener('touchstart', (e) => {
      if (!e.touches.length) return;
      lbTouchStartX = e.touches[0].clientX;
      lbTouchStartY = e.touches[0].clientY;
    }, { passive: true });

    lightboxStage.addEventListener('touchend', (e) => {
      if (!isLightboxGalleryMode || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - lbTouchStartX;
      const dy = e.changedTouches[0].clientY - lbTouchStartY;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
        goToSlide(dx < 0 ? currentSlideIndex + 1 : currentSlideIndex - 1, false);
      }
    }, { passive: true });
  }

  renderGallerySlides();
  startSlideshowTimer();

  // ==========================================
  // 10. QUICK ACTION BUTTONS
  // ==========================================
  function openDirections() {
    window.open('https://maps.app.goo.gl/dVaq5fmaRATvLRV79?g_st=aw', '_blank');
  }

  if (getDirectionsBtn) getDirectionsBtn.addEventListener('click', openDirections);
  if (venueCardClickable) venueCardClickable.addEventListener('click', openDirections);

  if (addToCalBtn) {
    addToCalBtn.addEventListener('click', () => {
      const title = `${eventData.nickName}'s 1st Birthday Celebration!`;
      const desc = `You're invited to celebrate ${eventData.fullName}'s 1st Birthday!`;
      const location = eventData.venueAddress || eventData.venueName;

      const dateClean = eventData.eventDate.replace(/-/g, '');
      const timeClean = eventData.eventTime.replace(/:/g, '') + '00';
      const startIso = `${dateClean}T${timeClean}`;

      const endH = String((parseInt(eventData.eventTime.split(':')[0], 10) + 3) % 24).padStart(2, '0');
      const endIso = `${dateClean}T${endH}${eventData.eventTime.split(':')[1]}00`;

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(location)}`;

      window.open(gcalUrl, '_blank');
    });
  }

  if (shareInviteBtn) {
    shareInviteBtn.addEventListener('click', async () => {
      const shareTitle = `${eventData.nickName}'s 1st Birthday Celebration!`;
      const shareText = `You're warmly invited to celebrate ${eventData.fullName}'s 1st Birthday on ${eventData.eventDate} at 7:30 PM (${eventData.venueName})! Join the celebration here:`;
      const shareUrl = window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
          });
          return;
        } catch (err) { }
      }

      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        alert('🎉 Invitation link & details copied to clipboard! You can paste it on WhatsApp or Messages.');
      }).catch(() => {
        prompt('Copy invitation link:', shareUrl);
      });
    });
  }

  // ==========================================
  // 12. AMBIENT SPARKLES & CONFETTI ENGINE
  // ==========================================
  function createAmbientStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;

    for (let i = 0; i < 24; i++) {
      const star = document.createElement('div');
      star.className = 'ambient-star';
      star.textContent = Math.random() > 0.5 ? '✦' : '★';
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.fontSize = `${Math.random() * 12 + 8}px`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.animationDuration = `${Math.random() * 4 + 4}s`;
      container.appendChild(star);
    }
  }

  createAmbientStars();

  function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#8A9A84', '#BC9E76', '#EBC7B2', '#D4AF37', '#F5EBDD', '#B5C4AF', '#E0A99A'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 80 - 40),
        y: canvas.height * 0.35,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 12,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let animationFrame;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeCount = 0;

      particles.forEach(p => {
        if (p.alpha > 0.01) {
          activeCount++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.32;
          p.rotation += p.rSpeed;
          p.alpha -= 0.012;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
          ctx.restore();
        }
      });

      if (activeCount > 0) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    renderConfetti();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ==========================================
  // 13. WONDERLAND SCROLL REVEAL OBSERVER
  // ==========================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Trigger scroll reveal on DOM ready & conclude welcome intro once
  function onReadySetup() {
    initScrollReveal();
    const heroSection = document.getElementById('heroSection');
    if (heroSection && heroSection.classList.contains('hero-intro-active')) {
      setTimeout(() => {
        heroSection.classList.remove('hero-intro-active');
        heroSection.classList.add('hero-intro-done');
      }, 2200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReadySetup);
  } else {
    onReadySetup();
  }

  // Interactive celebration bursts when tapping animals or balloons
  document.querySelectorAll('.hero-center-bear-wrap, .wonder-animal-img, .interactive-bear-holder, .train-track-scroller, .car-illustration-container').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      triggerConfetti();
    });
  });

  // Illustrated Calendar: Date card scroll & December 9th birthday burst
  const dateCardScrollTrigger = document.getElementById('dateCardScrollTrigger');
  if (dateCardScrollTrigger) {
    dateCardScrollTrigger.addEventListener('click', () => {
      scrollToElement('calendarSection');
    });
    dateCardScrollTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToElement('calendarSection');
      }
    });
  }

  const calBirthdayCell = document.getElementById('calBirthdayCell');
  if (calBirthdayCell) {
    calBirthdayCell.addEventListener('click', () => {
      playChimeEffect();
      triggerConfetti();
    });
  }

})();
