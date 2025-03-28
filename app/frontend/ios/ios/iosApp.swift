//
//  iosApp.swift
//  ios
//
//  Created by Tommy Neumaier on 03.06.24.
//

import SwiftUI

@main
struct iosApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
