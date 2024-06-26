import SwiftUI

struct FAQRow: View {
    var faq: FAQ

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(faq.question)
                .font(.headline)
                .foregroundColor(.primary)
            
            Text(faq.answer)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(10)
        .shadow(color: Color.black.opacity(0.1), radius: 5, x: 0, y: 2)
    }
}
