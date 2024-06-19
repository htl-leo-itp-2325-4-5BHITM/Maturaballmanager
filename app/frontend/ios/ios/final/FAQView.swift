import SwiftUI

struct FAQView: View {
    @StateObject private var viewModel = FAQViewModel()

    var body: some View {
        NavigationView {
            List(viewModel.faqs) { faq in
                DisclosureGroup(faq.question) {
                    Text(faq.answer)
                        .padding()
                }
                .padding()
            }
            .navigationTitle("FAQ")
            .onAppear {
                viewModel.fetchFAQs()
            }
        }
    }
}
