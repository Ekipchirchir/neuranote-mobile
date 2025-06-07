import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Increased for bottom nav
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#334155',
    marginVertical: 12,
    paddingLeft: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardText: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 24,
  },
  cardDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  button: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 80, // Above bottom nav
    right: 24,
    backgroundColor: '#7C3AED',
    elevation: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
});