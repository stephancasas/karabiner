#!/usr/bin/env osascript -l JavaScript

function run(_) {
  return Application('System Events')
    .applicationProcesses.byName('Messages')
    .windows.at(0)
    .groups.at(0)
    .groups.at(0)
    .groups.at(0)
    .groups.at(0)
    .groups.at(0)
    .groups.at(0)
    .groups.at(2)
    .groups.at(0)
    .groups.at(0)
    .groups.at(0)
    .groups.at(1)
    .groups.at(0)
    .buttons.whose({ description: 'Emoji picker' })
    .at(0)
    .click();
}
