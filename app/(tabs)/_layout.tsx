import React from 'react'
import { Tabs } from 'expo-router'
import { FloatingDock } from '@/components/FloatingDock'
import { useStore } from '@tanstack/react-store'
import { appStore } from '@/store/todos.store'
import { useVoice } from '@/hooks/useVoice'
import { RecordingSheet } from '@/components/RecordingSheet'
import { ConfirmReminderDialog } from '@/components/ConfirmReminderDialog'

export default function TabsLayout() {
  const {
    isListening,
    step,
    lastTranscript,
    audioUri,
    audioDurationMillis,
    isProcessing,
    parsedCandidate,
  } = useStore(appStore, (s) => s)

  const {
    startRecording,
    stopRecording,
    proceedToAIReview,
    saveConfirmedReminder,
    cancelWorkflow,
  } = useVoice()

  return (
    <>
      <Tabs
        tabBar={(props) => {
          const routeName = props.state.routes[props.state.index].name
          const activeTab = routeName === 'settings' ? 'settings' : 'home'

          const isRecordingScreen = routeName === 'record'

          return (
            <FloatingDock
              activeTab={activeTab}
              visible={!isRecordingScreen}
              onSelectTab={(tab) => {
                if (tab === 'home') {
                  props.navigation.navigate('index')
                } else if (tab === 'settings') {
                  props.navigation.navigate('settings')
                }
              }}
              onMicPress={() => {
                props.navigation.navigate('record')
              }}
              isListening={isListening}
            />
          )
        }}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          lazy: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="record"
          options={{
            title: 'Record',
            animation: 'fade',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            animation: 'shift',
          }}
        />
      </Tabs>

      {/* STEP 2: Review Audio Sheet */}
      {step === 'review_audio' && (
        <RecordingSheet
          transcript={lastTranscript}
          audioUri={audioUri}
          durationMillis={audioDurationMillis}
          isProcessing={isProcessing}
          onCancel={cancelWorkflow}
          onProceed={proceedToAIReview}
        />
      )}

      {/* STEP 3: Confirm Reminder AI Dialog */}
      <ConfirmReminderDialog
        open={step === 'confirm_reminder'}
        candidate={parsedCandidate}
        isSaving={isProcessing}
        onClose={cancelWorkflow}
        onSave={saveConfirmedReminder}
      />
    </>
  )
}
