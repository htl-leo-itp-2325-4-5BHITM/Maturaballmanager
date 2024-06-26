import SwiftUI

struct FAQView: View {
    @StateObject private var viewModel = FAQViewModel()

    var body: some View {
        NavigationView {
            ZStack {
                if viewModel.isLoading {
                    VStack {
                        Spacer()
                        ProgressView("Laden...")
                            .progressViewStyle(CircularProgressViewStyle())
                            .padding()
                        Spacer()
                    }
                } else {
                    List(viewModel.faqs) { faq in
                        FAQRow(faq: faq)
                            .padding(.vertical, 10)
                    }
                }
            }
            .navigationTitle("FAQ")
            .onAppear {
                viewModel.fetchFAQs()
            }
        }
    }
}

